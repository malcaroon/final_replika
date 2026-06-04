import db from '../config/db.js';

export const getUsers = async (req, res) => {
  try {
    const users = await db.selectFrom('students').selectAll().execute();
    res.status(200).json({users});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const getUserById = async (req, res) => {
  const {id} = req.params;

  try {
    const user = await db
      .selectFrom('students')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (user.length === 0) {
      return res.status(404).json({error: 'User not found'});
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const createUser = async (req, res) => {
  const {firstName, lastName, age, course} = req.body;

  try {
    const result = await db
      .insertInto('students')
      .values({firstName, lastName, age, course})
      .execute();

    res.status(201).json({
      message: 'User created successfully',
      student: {
        id: result.insertId,
        firstName,
        lastName,
        age,
        course
      }
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const updateUser = async (req, res) => {
  const {id} = req.params;
  const {firstName, lastName, age, course} = req.body;

  try {
    const result = await db
      .updateTable('students')
      .set({firstName, lastName, age, course})
      .where('id', '=', id)
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'User not found'});
    }

    res.status(200).json({message: 'User updated successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const patchUser = async (req, res) => {
  const {id} = req.params;
  const {firstName, lastName, age, course} = req.body;

  try {
    const updates = Object.fromEntries(
      Object.entries({
        firstName: firstName,
        lastName: lastName,
        age: age,
        course: course
      }).filter(([_, v]) => v !== undefined)
    );

    const result = db
      .updateTable('students')
      .set(updates)
      .where('id', '=', id)
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'User not found'});
    }

    res.status(200).json({message: 'User updated successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const deleteUserById = async (req, res) => {
  const {id} = req.params;

  try {
    const result = await db
      .deleteFrom('students')
      .where('id', '=', id)
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'User not found'});
    }

    res.status(200).json({message: 'User deleted successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
