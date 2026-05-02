import { useState, useEffect } from 'react';
import { Brain, Plus, LogOut, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { HabitList } from './HabitList';
import { CreateHabitModal } from './CreateHabitModal';
import { EditHabitModal } from './EditHabitModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ProgressDashboard } from './ProgressDashboard';
import { toast } from 'sonner';

export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: string;
  completedToday: boolean;
  history: { date: string; completed: boolean }[];
  reminder?: {
    enabled: boolean;
    time: string;
  };
}

interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

export function Dashboard({ userName, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'habits' | 'progress'>('habits');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Estudiar matemáticas',
      category: 'Académico',
      frequency: 'Diario',
      completedToday: true,
      history: [
        { date: '2026-04-28', completed: true },
        { date: '2026-04-29', completed: true },
        { date: '2026-04-30', completed: false },
        { date: '2026-05-01', completed: true },
      ],
      reminder: {
        enabled: true,
        time: '09:00',
      },
    },
    {
      id: '2',
      name: 'Leer 30 minutos',
      category: 'Personal',
      frequency: 'Diario',
      completedToday: false,
      history: [
        { date: '2026-04-28', completed: true },
        { date: '2026-04-29', completed: true },
        { date: '2026-04-30', completed: true },
        { date: '2026-05-01', completed: false },
      ],
      reminder: {
        enabled: true,
        time: '20:00',
      },
    },
  ]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      habits.forEach((habit) => {
        if (habit.reminder?.enabled && habit.reminder.time === currentTime && !habit.completedToday) {
          sendNotification(habit.name);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [habits]);

  const sendNotification = (habitName: string) => {
    if (notificationPermission === 'granted') {
      new Notification('MindTrack - Recordatorio', {
        body: `Es hora de: ${habitName}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    } else {
      toast.info(`Recordatorio: ${habitName}`);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        toast.success('Notificaciones activadas');
      } else {
        toast.error('Notificaciones bloqueadas');
      }
    }
  };

  const handleCreateHabit = (name: string, category: string, frequency: string, reminderEnabled: boolean, reminderTime: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      category,
      frequency,
      completedToday: false,
      history: [],
      reminder: {
        enabled: reminderEnabled,
        time: reminderTime,
      },
    };
    setHabits([...habits, newHabit]);
    setShowCreateModal(false);
    toast.success('Hábito creado exitosamente');

    if (reminderEnabled && notificationPermission !== 'granted') {
      requestNotificationPermission();
    }
  };

  const handleUpdateHabit = (habitId: string, name: string, category: string, frequency: string, reminderEnabled: boolean, reminderTime: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              name,
              category,
              frequency,
              reminder: {
                enabled: reminderEnabled,
                time: reminderTime,
              }
            }
          : habit
      )
    );
    setEditingHabit(null);
    toast.success('Hábito actualizado');

    if (reminderEnabled && notificationPermission !== 'granted') {
      requestNotificationPermission();
    }
  };

  const handleDeleteHabit = () => {
    if (deletingHabit) {
      setHabits(habits.filter((habit) => habit.id !== deletingHabit.id));
      toast.success('Hábito eliminado');
      setDeletingHabit(null);
    }
  };

  const handleToggleHabit = (habitId: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const today = new Date().toISOString().split('T')[0];
          const newCompletedStatus = !habit.completedToday;

          const historyWithoutToday = habit.history.filter((h) => h.date !== today);
          const newHistory = [
            ...historyWithoutToday,
            { date: today, completed: newCompletedStatus },
          ];

          return {
            ...habit,
            completedToday: newCompletedStatus,
            history: newHistory,
          };
        }
        return habit;
      })
    );
  };

  const completedCount = habits.filter((h) => h.completedToday).length;
  const totalCount = habits.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">MindTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Hola, {userName}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Notification Banner */}
        {notificationPermission !== 'granted' && habits.some(h => h.reminder?.enabled) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-yellow-900">Activa las notificaciones</p>
                <p className="text-sm text-yellow-700">Recibe recordatorios de tus hábitos en el navegador</p>
              </div>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Activar
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Hábitos Activos</p>
                <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Circle className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Completados Hoy</p>
                <p className="text-3xl font-bold text-gray-900">{completedCount}/{totalCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tasa de Cumplimiento</p>
                <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('habits')}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === 'habits'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Mis Hábitos
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === 'progress'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Progreso
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'habits' ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Hábitos Diarios</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Crear Hábito
                  </button>
                </div>
                <HabitList
                  habits={habits}
                  onToggle={handleToggleHabit}
                  onEdit={setEditingHabit}
                  onDelete={setDeletingHabit}
                />
              </div>
            ) : (
              <ProgressDashboard habits={habits} />
            )}
          </div>
        </div>
      </main>

      {showCreateModal && (
        <CreateHabitModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateHabit}
        />
      )}

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onClose={() => setEditingHabit(null)}
          onUpdate={handleUpdateHabit}
        />
      )}

      {deletingHabit && (
        <DeleteConfirmModal
          habitName={deletingHabit.name}
          onClose={() => setDeletingHabit(null)}
          onConfirm={handleDeleteHabit}
        />
      )}
    </div>
  );
}
