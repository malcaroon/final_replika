import db from '../config/db.js';

export const getUsers = async (req, res) => {
  try {
    const users = await db.selectFrom('products').selectAll().execute();
    res.status(200).json({users});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const getUserById = async (req, res) => {
  const {id} = req.params;

  try {
    const user = await db
      .selectFrom('products')
      .selectAll() 
      .where('id', '=', id)
      .executeTakeFirst();
  
    if (user.length === 0) {
      return res.status(404).json({error: 'Product not found'});
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const createProducts = async (req, res) => {
  const {name, price, description, category, stock} = req.body;

  try {
    const result = await db
      .insertInto('products')
      .values({name, price, description, category, stock})
      .execute();

    res.status(201).json({
      message: 'Product created successfully',
      student: {
        id: result.insertId,
        name,
        price,
        description,
        category,
        stock,
      }
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const updateProduct = async (req, res) => {
  const {id} = req.params;
  const {name, price, description, category, stock} = req.body;

  try {
    const result = await db
      .updateTable('products')
      .set({name, price, description, category, stock})
      .where('id', '=', id)
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'Product not found'});
    }

    res.status(200).json({message: 'Product updated successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const patchUser = async (req, res) => {
  const {id} = req.params;
  const {name, price, description, category, stock} = req.body;

  try {
    const updates = Object.fromEntries(
      Object.entries({
        name: name,
        price: price,
        description: description,
        category: category,
        stock: stock, 
      }).filter(([_, v]) => v !== undefined)
    );

    const result = db
      .updateTable('Products')
      .set(updates)
      .where('id', '=', id)
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'Products not found'});
    }

    res.status(200).json({message: 'Products updated successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const deleteUserById = async (req, res) => {
  const {id} = req.params;

  try {
    const result = await db
      .deleteFrom('products')
      .where('id', '=', id)
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'Prducts not found'});
    }

    res.status(200).json({message: 'Products deleted successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
