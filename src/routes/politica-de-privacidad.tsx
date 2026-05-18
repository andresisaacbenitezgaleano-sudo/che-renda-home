import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/politica-de-privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad — Che Renda T&T" },
      {
        name: "description",
        content:
          "Política de Privacidad y Tratamiento de Datos Personales de Che Renda Tour & Travel conforme a la Ley N° 7593/2025 de Paraguay.",
      },
    ],
  }),
  component: PrivacidadPage,
});

function PrivacidadPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-bold">Política de Privacidad</h1>
          <p className="text-sm text-muted-foreground">
            Che Renda Tour & Travel — Versión 1.0 · Vigente desde 2026
          </p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-foreground/90">
          <p>
            La presente Política regula el tratamiento de los Datos Personales
            recabados por <strong>Che Renda Tour & Travel</strong> (en adelante,
            "Che Renda T&T") en el marco de su plataforma de intermediación de
            alquiler vacacional y turismo en la República del Paraguay, conforme
            a la <strong>Ley N° 7593/2025 de Protección de Datos Personales</strong>{" "}
            y demás normas concordantes.
          </p>

          <h2 className="font-display text-xl font-semibold">1. Identificación del Responsable</h2>
          <p>
            Che Renda T&T opera con número de RUC inscripto ante la{" "}
            <strong>Dirección Nacional de Ingresos Tributarios (DNIT)</strong>{" "}
            de la República del Paraguay. Para consultas o ejercicio de
            derechos: <strong>[soporte@cherenda.com.py]</strong> · Teléfono:{" "}
            <strong>[+595 9XX XXX XXX]</strong> · Domicilio:{" "}
            <strong>[Dirección oficial en Paraguay]</strong>.
          </p>

          <h2 className="font-display text-xl font-semibold">2. Datos que recopilamos</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Datos de identificación: nombre, apellido, correo, teléfono.</li>
            <li>Datos transaccionales de reservas y publicaciones.</li>
            <li>
              <strong>Datos de geolocalización</strong> aproximada del
              dispositivo, utilizados exclusivamente para mostrar alojamientos
              cercanos y mejorar la experiencia.
            </li>
            <li>
              Datos fiscales de anfitriones (RUC, razón social) cuando
              correspondan, conforme a obligaciones tributarias de la DNIT.
            </li>
            <li>Datos técnicos de navegación e identificadores de sesión.</li>
          </ul>

          <h2 className="font-display text-xl font-semibold">3. Finalidades del tratamiento</h2>
          <p>
            Los datos se utilizan para: (i) gestionar tu cuenta y validar tu
            identidad; (ii) facilitar reservas entre huéspedes y anfitriones;
            (iii) <strong>verificar pagos a través del Sistema de Pagos del Paraguay (SIPAP)</strong>{" "}
            y emitir comprobantes electrónicos; (iv) cumplir con obligaciones
            legales y tributarias ante la DNIT; (v) prevenir fraude y proteger
            la seguridad de la plataforma; (vi) enviarte comunicaciones
            relevantes sobre tus operaciones.
          </p>

          <h2 className="font-display text-xl font-semibold">4. Transferencias y terceros</h2>
          <p>
            Compartimos datos únicamente con: (a) la contraparte de la reserva
            (anfitrión o huésped), en lo estrictamente necesario para la
            estadía; (b) entidades financieras habilitadas para el
            procesamiento de cobros y transferencias SIPAP; (c) autoridades
            competentes, cuando exista requerimiento legal. <strong>Nunca
            vendemos ni cedemos tus datos a terceros con fines comerciales.</strong>
          </p>

          <h2 className="font-display text-xl font-semibold">5. Derechos ARCO+ del Titular</h2>
          <p>
            Conforme a la Ley N° 7593/2025, podés ejercer los derechos de{" "}
            <strong>Acceso, Rectificación, Cancelación, Oposición, Portabilidad
            y Limitación del tratamiento (ARCO+)</strong> escribiendo a{" "}
            <strong>[soporte@cherenda.com.py]</strong>. Responderemos tu
            solicitud en los plazos previstos por la normativa vigente.
          </p>

          <h2 className="font-display text-xl font-semibold">6. Seguridad y conservación</h2>
          <p>
            Aplicamos medidas técnicas y organizativas para proteger tus datos
            (cifrado en tránsito, control de acceso por filas — RLS,
            autenticación robusta). Conservamos la información durante el
            tiempo necesario para cumplir las finalidades y obligaciones
            legales aplicables.
          </p>

          <h2 className="font-display text-xl font-semibold">7. Cookies</h2>
          <p>
            Utilizamos cookies técnicas y de sesión para mantener tu
            autenticación y preferencias. Podés deshabilitarlas en tu
            navegador, aunque algunas funciones podrían dejar de operar.
          </p>

          <h2 className="font-display text-xl font-semibold">8. Aceptación y trazabilidad</h2>
          <p>
            Al crear tu cuenta marcaste activamente los checkboxes de
            aceptación de Política de Privacidad y Términos y Condiciones.
            Registramos la fecha exacta de aceptación y la versión vigente del
            documento como evidencia de tu consentimiento (modelo clickwrap).
          </p>

          <h2 className="font-display text-xl font-semibold">9. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política reflejando mejoras o cambios
            legales. Te notificaremos por correo electrónico cuando las
            modificaciones sean sustanciales.
          </p>
        </section>
      </article>
    </SiteShell>
  );
}
