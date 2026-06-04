import db from '../config/db.js';

export const getUsers = async (req, res) => {
  try {
    const users = await db.selectFrom('promo').selectAll().execute();
    res.status(200).json({users});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const getUserById = async (req, res) => {
  const {id} = req.params;

  try {
    const user = await db
      .selectFrom('promo')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (user.length === 0) {
      return res.status(404).json({error: 'Promo not found'});
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const createUser = async (req, res) => {
  const {title, discountRate, startDate, description, promoType, products, endDate} = req.body;

  try {
    const result = await db
      .insertInto('promo')
      .values({title, discountRate, startDate, description, promoType, products, endDate})
      .execute();

    res.status(201).json({
      message: 'Promo created successfully',
      promo: {
        id: result.insertId,
        title,
        discountRate,
        startDate,
        description,
        promoType,
        products,
        endDate
      }
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const updateUser = async (req, res) => {
  const {id} = req.params;
  const {title, discountRate, startDate, description, promoType, products, endDate} = req.body;

  try {
    const result = await db
      .updateTable('promo')
      .set({title, discountRate, startDate, description, promoType, products, endDate})
      .where('id', '=', id)
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'Promo not found'});
    }

    res.status(200).json({message: 'Promo updated successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const patchUser = async (req, res) => {
  const {id} = req.params;
  const {title, discountRate, startDate, description, promoType, products, endDate} = req.body;

  try {
    const updates = Object.fromEntries(
      Object.entries({
        title: title,
        discountRate: discountRate,
        startDate: startDate,
        description: description,
        promoType: promoType,
        products: products,
        endDate: endDate
      }).filter(([_, v]) => v !== undefined)
    );

    const result = db
      .updateTable('promo')
      .set(updates)
      .where('id', '=', id)
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'Promo not found'});
    }

    res.status(200).json({message: 'Promo updated successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const deleteUserById = async (req, res) => {
  const {id} = req.params;

  try {
    const result = await db
      .deleteFrom('promo')
      .where('id', '=', id)
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'Promo not found'});
    }

    res.status(200).json({message: 'Promo deleted successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
