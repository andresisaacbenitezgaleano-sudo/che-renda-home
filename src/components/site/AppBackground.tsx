import bg from "@/assets/bg-paraguay-wood.jpg";

/**
 * Fondo estático fijo (bandera PY con textura de madera) + overlay
 * para mantener legibilidad de todo el contenido frontal.
 * Se monta una sola vez en el root.
 */
export function AppBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px] dark:bg-background/90" />
    </div>
  );
}
