import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/politica-de-privacidad")({
  head: () => ({ meta: [{ title: "Política de Privacidad — Che Renda T&T" }] }),
  component: PrivacidadPage,
});

function PrivacidadPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
        <h1 className="font-display text-3xl font-bold">Política de Privacidad</h1>
        <p className="text-sm text-muted-foreground">Última actualización: 2026</p>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-xl font-semibold">1. Datos que recopilamos</h2>
          <p>
            Recopilamos los datos que nos suministrás al registrarte (nombre, email,
            teléfono), información de tus reservas y publicaciones, y datos técnicos
            de navegación necesarios para operar la plataforma.
          </p>

          <h2 className="font-display text-xl font-semibold">2. Uso de la información</h2>
          <p>
            Usamos tus datos para gestionar tu cuenta, procesar reservas, comunicarte
            novedades, mejorar el servicio y cumplir obligaciones legales en Paraguay.
          </p>

          <h2 className="font-display text-xl font-semibold">3. Compartir con terceros</h2>
          <p>
            Solo compartimos datos con anfitriones o huéspedes en el contexto de una
            reserva, con proveedores de pago y con autoridades competentes cuando la
            ley lo exija. Nunca vendemos tus datos personales.
          </p>

          <h2 className="font-display text-xl font-semibold">4. Almacenamiento y seguridad</h2>
          <p>
            Tu información se almacena de forma cifrada y protegida con políticas de
            acceso por filas (Row Level Security) y autenticación robusta. Aplicamos
            buenas prácticas para prevenir accesos no autorizados.
          </p>

          <h2 className="font-display text-xl font-semibold">5. Tus derechos</h2>
          <p>
            Podés acceder, rectificar o solicitar la eliminación de tus datos
            escribiéndonos desde <strong>Te escuchamos</strong> o a
            privacidad@cherenda.com.py.
          </p>

          <h2 className="font-display text-xl font-semibold">6. Cookies</h2>
          <p>
            Usamos cookies técnicas y de sesión para mantener tu autenticación y
            mejorar la experiencia. Podés deshabilitarlas en tu navegador, aunque
            algunas funciones podrían dejar de operar correctamente.
          </p>

          <h2 className="font-display text-xl font-semibold">7. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política para reflejar mejoras o cambios legales.
            Te avisaremos por email si las modificaciones son sustanciales.
          </p>
        </section>
      </article>
    </SiteShell>
  );
}
