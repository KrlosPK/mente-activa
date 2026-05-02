import { Brain, Target, TrendingUp, Users } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">MindTrack</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onLogin}
            className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={onRegister}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Registrarse
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transforma tus rutinas con <span className="text-indigo-600">micro-hábitos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            MindTrack te ayuda a organizar tu vida estudiantil mediante el seguimiento
            inteligente de hábitos y rutinas diarias.
          </p>
          <button
            onClick={onRegister}
            className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700 transition-colors"
          >
            Comienza Gratis
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Micro-hábitos</h3>
            <p className="text-gray-600">
              Crea hábitos pequeños y alcanzables que se adapten a tu rutina universitaria.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seguimiento Visual</h3>
            <p className="text-gray-600">
              Monitorea tu progreso con gráficos intuitivos y estadísticas en tiempo real.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Diseñado para estudiantes</h3>
            <p className="text-gray-600">
              Interfaz simple y efectiva pensada para la vida académica universitaria.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-indigo-600 rounded-2xl p-12 text-white text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">92%</div>
              <div className="text-indigo-100">Tasa de éxito en tareas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3 min</div>
              <div className="text-indigo-100">Tiempo promedio de uso</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.6/5</div>
              <div className="text-indigo-100">Satisfacción de usuarios</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
