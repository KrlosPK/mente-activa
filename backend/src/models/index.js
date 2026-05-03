import { User } from './User.js';
import { Habit } from './Habit.js';

// Relaciones
User.hasMany(Habit, { foreignKey: 'userId' });
Habit.belongsTo(User, { foreignKey: 'userId' });

export { User, Habit };