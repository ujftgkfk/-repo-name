import { Request, Response } from 'express';
import { User } from '../models/User';

export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      userId: user.id,
      balance: parseFloat(user.balance.toString()),
      currency: user.currency,
    });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
};

export const deposit = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.balance = parseFloat(user.balance.toString()) + parseFloat(amount);
    await user.save();

    res.json({
      success: true,
      balance: parseFloat(user.balance.toString()),
      message: `Deposited ${amount} ${user.currency}`,
    });
  } catch (error) {
    console.error('Error depositing:', error);
    res.status(500).json({ error: 'Failed to deposit' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      balance: parseFloat(user.balance.toString()),
      currency: user.currency,
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = await User.create({
      username,
      balance: 1000.00,
      currency: 'USD',
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      balance: parseFloat(user.balance.toString()),
      currency: user.currency,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};
