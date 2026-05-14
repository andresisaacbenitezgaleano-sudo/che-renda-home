import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/terminos-y-condiciones")({
  head: () => ({ meta: [{ title: "Términos y Condiciones — Che Renda T&T" }] }),
  component: TerminosPage,
});

function TerminosPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
        <h1 className="font-display text-3xl font-bold">Términos y Condiciones</h1>
        <p className="text-sm text-muted-foreground">Última actualización: 2026</p>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-xl font-semibold">1. Aceptación</h2>
          <p>
            Al utilizar Che Renda Tour and Travel ("la plataforma") aceptás estos
            Términos y Condiciones. Si no estás de acuerdo, te pedimos no usar el
            servicio.
          </p>

          <h2 className="font-display text-xl font-semibold">2. Cuentas de usuario</h2>
          <p>
            Sos responsable de la veracidad de los datos suministrados durante el
            registro y de mantener la confidencialidad de tu contraseña. Cualquier
            actividad realizada desde tu cuenta es de tu responsabilidad.
          </p>

          <h2 className="font-display text-xl font-semibold">3. Reservas y pagos</h2>
          <p>
            Las reservas se rigen por las condiciones publicadas por cada anfitrión.
            Los precios se exhiben en Guaraníes (Gs.) e incluyen impuestos cuando
            corresponda. Los pagos deben realizarse exclusivamente dentro de la
            plataforma.
          </p>

          <h2 className="font-display text-xl font-semibold">4. Cancelaciones</h2>
          <p>
            Las cancelaciones se rigen por la Política de Cancelación vigente y por
            las normas particulares de cada anuncio. Che Renda T&T puede mediar en
            disputas y aplicar reembolsos según corresponda.
          </p>

          <h2 className="font-display text-xl font-semibold">5. Conducta de los usuarios</h2>
          <p>
            Está prohibido utilizar la plataforma para fines ilícitos, publicar
            contenido falso, suplantar identidades o eludir las medidas de seguridad.
            Che Renda T&T se reserva el derecho de suspender cuentas que infrinjan
            estas normas.
          </p>

          <h2 className="font-display text-xl font-semibold">6. Propiedad intelectual</h2>
          <p>
            Todo el contenido de Che Renda T&T (marca, diseño, código) es propiedad
            de la empresa y está protegido por las leyes vigentes en Paraguay.
          </p>

          <h2 className="font-display text-xl font-semibold">7. Limitación de responsabilidad</h2>
          <p>
            Che Renda T&T actúa como intermediario entre anfitriones y huéspedes y
            no es responsable directo del estado de las propiedades ni del
            comportamiento de los usuarios. Trabajamos para resolver inconvenientes
            con la mayor diligencia.
          </p>

          <h2 className="font-display text-xl font-semibold">8. Contacto</h2>
          <p>
            Para consultas o reclamos podés escribirnos desde la sección{" "}
            <strong>Te escuchamos</strong> o a soporte@cherenda.com.py.
          </p>
        </section>
      </article>
    </SiteShell>
  );
}
