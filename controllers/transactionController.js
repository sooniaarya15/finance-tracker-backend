const Transaction = require('../models/Transaction');

// GET /api/transactions?type=&category=&startDate=&endDate=
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/transactions
exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount, note, date } = req.body;

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' });
    }
    if (!category) return res.status(400).json({ message: 'Category is required' });
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount: Number(amount),
      note,
      date: date || Date.now(),
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};