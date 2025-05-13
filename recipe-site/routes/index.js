const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// ✅ UPDATED: Recipe list page with grouping
router.get('/recipes', (req, res) => {
  const db = req.app.locals.db;
  const sql = 'SELECT * FROM recipes';

  db.query(sql, (err, results) => {
    if (err) throw err;

    // Group recipes by protein_type
    const grouped = {};
    results.forEach(recipe => {
      if (!grouped[recipe.protein_type]) {
        grouped[recipe.protein_type] = [];
      }
      grouped[recipe.protein_type].push(recipe);
    });

    res.render('recipes', { title: 'Recipes', groupedRecipes: grouped });
  });
});

// Individual recipe page
router.get('/recipes/:id', (req, res) => {
  const db = req.app.locals.db;
  const recipeId = req.params.id;

  const recipeQuery = 'SELECT * FROM recipes WHERE id = ?';
  const ingredientsQuery = `
    SELECT i.name, i.info FROM ingredients i
    JOIN recipe_ingredients ri ON ri.ingredient_id = i.id
    WHERE ri.recipe_id = ?
  `;

  db.query(recipeQuery, [recipeId], (err, recipeResults) => {
    if (err) throw err;
    if (recipeResults.length === 0) {
      return res.send('Recipe not found');
    }

    db.query(ingredientsQuery, [recipeId], (err2, ingredientResults) => {
      if (err2) throw err2;

      res.render('recipe', {
        title: recipeResults[0].name,
        recipe: recipeResults[0],
        ingredients: ingredientResults
      });
    });
  });
});

// Show Add Recipe Form
router.get('/add', (req, res) => {
  const db = req.app.locals.db;
  db.query('SELECT * FROM ingredients', (err, results) => {
    if (err) throw err;
    res.render('add', { title: 'Add Recipe', ingredients: results });
  });
});

// Handle Add Recipe Submission
router.post('/add', (req, res) => {
  const db = req.app.locals.db;
  const { name, protein_type, instructions, ingredients, new_ingredients } = req.body;

  const recipeSql = 'INSERT INTO recipes (name, protein_type, instructions) VALUES (?, ?, ?)';
  db.query(recipeSql, [name, protein_type, instructions], (err, result) => {
    if (err) throw err;

    const recipeId = result.insertId;
    const selected = Array.isArray(ingredients) ? ingredients : (ingredients ? [ingredients] : []);
    const newIngredientList = new_ingredients
      ? new_ingredients.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const insertNewIngredients = (callback) => {
      if (newIngredientList.length === 0) return callback([]);

      const insertSql = 'INSERT INTO ingredients (name, info) VALUES ?';
      const values = newIngredientList.map(name => [name, 'User-added ingredient']);

      db.query(insertSql, [values], (err, insertResult) => {
        if (err) throw err;

        const newIds = Array.from({ length: insertResult.affectedRows }, (_, i) => insertResult.insertId + i);
        callback(newIds.map(String));
      });
    };

    insertNewIngredients((newIds) => {
      const allIngredientIds = [...selected, ...newIds];
      if (allIngredientIds.length === 0) return res.redirect('/recipes');

      const linkSql = 'INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ?';
      const values = allIngredientIds.map(id => [recipeId, id]);

      db.query(linkSql, [values], (err2) => {
        if (err2) throw err2;
        res.redirect('/recipes');
      });
    });
  });
});

module.exports = router;
