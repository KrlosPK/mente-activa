import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Habit } from './Dashboard';

interface ProgressDashboardProps {
  habits: Habit[];
}

export function ProgressDashboard({ habits }: ProgressDashboardProps) {
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const chartData = last7Days.map((date) => {
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'short' });

    let completed = 0;
    habits.forEach((habit) => {
      const historyEntry = habit.history.find((h) => h.date === date);
      if (historyEntry && historyEntry.completed) {
        completed++;
      }
    });

    const total = habits.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      completed,
      total,
      percentage,
    };
  });

  const categoryStats = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = { total: 0, completed: 0 };
    }
    acc[habit.category].total++;
    if (habit.completedToday) {
      acc[habit.category].completed++;
    }
    return acc;
  }, {} as { [key: string]: { total: number; completed: number } });

  const categoryData = Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    percentage: Math.round((stats.completed / stats.total) * 100),
  }));

  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.completedToday).length;
  const overallPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const totalCompletions = habits.reduce((sum, habit) => {
    return sum + habit.history.filter((h) => h.completed).length;
  }, 0);

  const averageStreak = totalHabits > 0 ? Math.round(totalCompletions / totalHabits) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen Semanal</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'percentage') return [`${value}%`, 'Cumplimiento'];
                  return [value, name === 'completed' ? 'Completados' : 'Total'];
                }}
              />
              <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.percentage >= 75 ? '#10B981' : entry.percentage >= 50 ? '#F59E0B' : '#6366F1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Estadísticas Generales</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg">
            <p className="text-indigo-900 text-sm mb-2">Cumplimiento de Hoy</p>
            <p className="text-4xl font-bold text-indigo-600">{overallPercentage}%</p>
            <p className="text-indigo-700 text-sm mt-2">
              {completedToday} de {totalHabits} hábitos completados
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <p className="text-green-900 text-sm mb-2">Racha Promedio</p>
            <p className="text-4xl font-bold text-green-600">{averageStreak} días</p>
            <p className="text-green-700 text-sm mt-2">
              Seguimiento constante de tus hábitos
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Por Categoría</h2>
        <div className="space-y-3">
          {categoryData.map((item) => (
            <div key={item.category} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{item.category}</span>
                <span className="font-semibold text-indigo-600">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
