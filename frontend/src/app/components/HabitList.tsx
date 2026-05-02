import { CheckCircle2, Circle, Pencil, Trash2, Bell, BellOff } from 'lucide-react';
import type { Habit } from './Dashboard';

interface HabitListProps {
  habits: Habit[];
  onToggle: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

const categoryColors: { [key: string]: string } = {
  'Académico': 'bg-blue-100 text-blue-800',
  'Personal': 'bg-green-100 text-green-800',
  'Salud': 'bg-pink-100 text-pink-800',
  'Social': 'bg-purple-100 text-purple-800',
  'Otro': 'bg-gray-100 text-gray-800',
};

export function HabitList({ habits, onToggle, onEdit, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <Circle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No tienes hábitos creados aún.</p>
        <p className="text-gray-500 text-sm mt-1">
          Comienza creando tu primer micro-hábito.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <button
            onClick={() => onToggle(habit.id)}
            className="flex-shrink-0"
          >
            {habit.completedToday ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
            )}
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-medium ${habit.completedToday ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {habit.name}
              </h3>
              {habit.reminder?.enabled && (
                <Bell className="w-4 h-4 text-indigo-600" title={`Recordatorio a las ${habit.reminder.time}`} />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[habit.category] || categoryColors['Otro']}`}>
                {habit.category}
              </span>
              <span className="text-xs text-gray-500">{habit.frequency}</span>
              {habit.reminder?.enabled && (
                <span className="text-xs text-indigo-600">🔔 {habit.reminder.time}</span>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="text-right mr-2">
              <p className="text-sm text-gray-600">
                Racha: {habit.history.filter(h => h.completed).length} días
              </p>
            </div>
            <button
              onClick={() => onEdit(habit)}
              className="p-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Editar hábito"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(habit)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar hábito"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
