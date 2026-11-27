import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/sections/shared/PageIntro";
import { features } from "@/config/features";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como os dados enviados pelo formulário de contato são tratados, conforme a LGPD (Lei nº 13.709/2018).",
  alternates: { canonical: "/privacidade" },
};

const LAST_UPDATE = "26 de novembro de 2026";

export default function PrivacidadePage() {
  const contactChannel = siteConfig.email ? (
    <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">
      {siteConfig.email}
    </a>
  ) : (
    <Link href="/contato" className="underline underline-offset-4">
      página de contato
    </Link>
  );

  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="POLÍTICA DE PRIVACIDADE."
        description={`Última atualização: ${LAST_UPDATE}.`}
      />

      <section
        aria-label="Texto da política de privacidade"
        className="section-shell bg-off-white text-carbon-black"
      >
        <div className="section-wrap">
          <div className="max-w-3xl space-y-12 text-base leading-relaxed [&_h2]:font-condensed [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:leading-none [&_h2]:tracking-tight [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
            <section>
              <h2>1. Quem é o controlador</h2>
              <p>
                Este site é mantido por {siteConfig.name} ({siteConfig.role}), que
                atua como controlador dos dados pessoais tratados a partir do
                formulário de contato. Dúvidas sobre esta política podem ser
                enviadas pela {contactChannel}.
              </p>
            </section>

            <section>
              <h2>2. Quais dados são coletados</h2>
              <p>Ao enviar o formulário de contato, coletamos:</p>
              <ul>
                <li>nome;</li>
                <li>e-mail;</li>
                <li>telefone ou WhatsApp (opcional);</li>
                <li>tipo de projeto de interesse;</li>
                <li>conteúdo da mensagem;</li>
                <li>registro do seu consentimento com esta política.</li>
              </ul>
              <p>
                Não solicitamos dados pessoais sensíveis. Pedimos que você evite
                incluí-los na mensagem.
              </p>
            </section>

            <section>
              <h2>3. Para que usamos os dados</h2>
              <p>
                Os dados são usados exclusivamente para responder ao seu contato,
                entender a necessidade do projeto, elaborar propostas e orçamentos
                e manter o histórico dessa conversa. Não utilizamos os dados do
                formulário para envio de publicidade sem o seu pedido.
              </p>
            </section>

            <section>
              <h2>4. Base legal</h2>
              <p>
                O tratamento se baseia no seu consentimento (art. 7º, I, da LGPD),
                manifestado ao marcar a caixa de concordância antes do envio, e,
                quando a conversa evoluir para uma contratação, na execução de
                procedimentos preliminares relacionados a contrato do qual você
                seja parte (art. 7º, V).
              </p>
            </section>

            <section>
              <h2>5. Compartilhamento</h2>
              <p>
                Os dados não são vendidos. Podem ser processados por prestadores de
                serviço necessários ao funcionamento do site e ao recebimento da
                mensagem (hospedagem e serviço de envio de e-mail), que atuam
                conforme as instruções do controlador. Também poderão ser
                compartilhados se houver obrigação legal ou ordem de autoridade
                competente.
              </p>
            </section>

            <section>
              <h2>6. Por quanto tempo guardamos</h2>
              <p>
                Mantemos os dados pelo tempo necessário para o atendimento do seu
                contato e para o cumprimento de eventuais obrigações legais ou
                contratuais. Depois disso, eles são eliminados ou anonimizados.
              </p>
            </section>

            <section>
              <h2>7. Seus direitos</h2>
              <p>
                Nos termos do art. 18 da LGPD, você pode solicitar, a qualquer
                momento:
              </p>
              <ul>
                <li>confirmação da existência de tratamento e acesso aos dados;</li>
                <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>portabilidade, quando aplicável;</li>
                <li>informação sobre com quem os dados foram compartilhados;</li>
                <li>revogação do consentimento e eliminação dos dados tratados com base nele.</li>
              </ul>
              <p>Para exercer esses direitos, utilize a {contactChannel}.</p>
            </section>

            <section>
              <h2>8. Cookies e medição</h2>
              <p>
                {features.analyticsEnabled
                  ? "Este site utiliza ferramentas de medição de audiência para entender o uso das páginas. Quando exigido, solicitaremos o seu consentimento antes de ativá-las."
                  : "Este site não utiliza cookies de publicidade nem ferramentas de análise de audiência no momento. Se isso mudar, esta política será atualizada e o consentimento será solicitado quando necessário."}
              </p>
            </section>

            <section>
              <h2>9. Segurança</h2>
              <p>
                Adotamos medidas técnicas e organizacionais razoáveis para proteger
                os dados contra acesso não autorizado, perda ou alteração. Nenhum
                sistema é totalmente imune a falhas, mas tratamos qualquer
                incidente conforme a legislação aplicável.
              </p>
            </section>

            <section>
              <h2>10. Alterações nesta política</h2>
              <p>
                Esta política pode ser atualizada para refletir mudanças no site ou
                na legislação. A data da última atualização está sempre indicada no
                topo desta página.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
