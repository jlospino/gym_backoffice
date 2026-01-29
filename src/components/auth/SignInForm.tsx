import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { supabase } from "../../supabaseClient";
import { useAuthStore } from "../../store/authStore";
import Alert from "../ui/alert/Alert";
import { supabaseAuthErrorCodes } from "../../utils/constants";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [authError, setAuthError] = useState('');

  const { setSession, fetchUserRole } = useAuthStore();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (!email || !password) {
        setAuthError("Por favor, complete todos los campos")
        return;
      }
      const { error, data } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setAuthError(supabaseAuthErrorCodes[error.code as keyof typeof supabaseAuthErrorCodes] || "Error al iniciar sesión")
        return;
      }
      setSession(data.session);

      if (data.session) {
        await fetchUserRole(data.session.user.id);
      }

      setAuthError("");
    } catch (error) {
      setAuthError("Ocurrió un error al iniciar sesión, por favor intente nuevamente")
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingrese su correo electrónico y contraseña para iniciar sesión.
            </p>
          </div>

          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Correo electrónico <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input type="email" placeholder="info@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label>
                    Contraseña <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingrese su contraseña"
                      className="dark:bg-deep-charcoal"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {authError && (
                  <Alert
                    message={authError}
                    title="Ups!! Algo salió mal"
                    variant="error"
                  />
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Recordarme
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-primary hover:text-primary/90 dark:text-primary"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={loading}>
                    {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
