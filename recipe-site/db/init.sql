DROP DATABASE IF EXISTS recipes_db;
CREATE DATABASE recipes_db;
USE recipes_db;

CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  info TEXT
);

CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  protein_type VARCHAR(50),
  instructions TEXT
);

CREATE TABLE recipe_ingredients (
  recipe_id INT,
  ingredient_id INT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

-- Sample Data
INSERT INTO ingredients (name, info) VALUES
('Garlic', 'Used in many cuisines. Known for its strong flavor and health benefits.'),
('Chicken Breast', 'Lean protein, common in many recipes. Cook to 165°F.'),
('Soy Sauce', 'Originated in China. Adds umami flavor.'),
('Olive Oil', 'Healthy fat from olives. Good for sautéing.');

INSERT INTO recipes (name, protein_type, instructions) VALUES
('Garlic Chicken Stir Fry', 'Chicken', '1. Sauté garlic in oil. 2. Add chicken. 3. Add sauce.');

INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);
