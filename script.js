/**
 * Configuração Rápida do Motoboy
 */
const CONFIG = {
    nome: "Vanderley Melo Express", // Insira o nome do motoboy ou empresa
    telefone: "5511912173040", // Insira no formato: 55 + DDD + Número (ex: 5511999998888)
    instagram: "https://instagram.com/SEU_USUARIO", // Insira o link do perfil do Instagram

    // Horário de atendimento — usado para o status "Ativo agora" no topo do site
    // diasAtivos: 0=domingo, 1=segunda, 2=terça, 3=quarta, 4=quinta, 5=sexta, 6=sábado
    horarioAtendimento: {
        diasAtivos: [1, 2, 3, 4, 5], // Segunda a Sexta
        horaInicio: 8,  // 08:00
        horaFim: 20     // 20:00
    },

    // Mensagem com marcações em texto puro (100% compatível com o WhatsApp Web e celular)
    mensagemWhatsApp: "Olá! Vi seu site e gostaria de solicitar uma entrega.\n" +
                      "➢ Bairro de Origem:\n" +
                      "➢ Bairro de Destino:\n" +
                      "➢ O que será transportado:",

    // Depoimentos exibidos na seção "O Que Dizem Nossos Clientes"
    // Edite/adicione itens livremente (nota de 1 a 5)
    depoimentos: [
        {
            nota: 5,
            texto: "Serviço rápido e muito confiável, entregou meu documento em tempo recorde!",
            autor: "Cliente — E-commerce"
        },
        {
            nota: 5,
            texto: "Cuidado total com a encomenda delicada. Recomendo demais!",
            autor: "Cliente — Loja Física"
        },
        {
            nota: 5,
            texto: "Atendimento educado e comunicação clara durante toda a corrida.",
            autor: "Cliente — Escritório"
        }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Atualiza o nome no Header
    const nameElement = document.getElementById("motoboy-name");
    if (nameElement) {
        nameElement.textContent = CONFIG.nome;
    }

    // 2. Monta o link do WhatsApp usando encodeURIComponent
    const encodedMessage = encodeURIComponent(CONFIG.mensagemWhatsApp);
    const whatsappUrl = `https://wa.me/${CONFIG.telefone}?text=${encodedMessage}`;

    // 3. Aplica o link nos botões de ação
    const btnMain = document.getElementById("wa-btn-main");
    const btnFloat = document.getElementById("wa-btn-float");

    if (btnMain) btnMain.href = whatsappUrl;
    if (btnFloat) btnFloat.href = whatsappUrl;

    // 4. Atualiza o ano no rodapé
    const currentYearSpan = document.getElementById("current-year");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 5. Atualiza a barra de status com base no horário real de atendimento
    function atualizarStatusAtendimento() {
        const statusBar = document.getElementById("status-bar");
        const statusText = document.getElementById("status-text");
        if (!statusBar || !statusText) return;

        const agora = new Date();
        const diaAtual = agora.getDay();
        const horaAtual = agora.getHours();
        const { diasAtivos, horaInicio, horaFim } = CONFIG.horarioAtendimento;

        const dentroDoHorario = diasAtivos.includes(diaAtual) && horaAtual >= horaInicio && horaAtual < horaFim;

        if (dentroDoHorario) {
            statusBar.classList.remove("status-offline");
            statusBar.classList.add("status-online");
            statusText.textContent = "Atendimento Ativo Agora — Resposta rápida no WhatsApp";
        } else {
            statusBar.classList.remove("status-online");
            statusBar.classList.add("status-offline");
            statusText.textContent = "Fora do horário de atendimento — Deixe sua mensagem que respondo assim que possível";
        }
    }

    atualizarStatusAtendimento();
    // Reavalia a cada minuto, caso o visitante fique com a página aberta e o horário mude
    setInterval(atualizarStatusAtendimento, 60000);

    // 6. Aplica o link do Instagram
    const instagramLink = document.getElementById("social-instagram");
    if (instagramLink && CONFIG.instagram) {
        instagramLink.href = CONFIG.instagram;
    }

    // 7. Renderiza os depoimentos (sem uso de innerHTML com dados externos, evitando XSS)
    const testimonialsGrid = document.getElementById("testimonials-grid");
    if (testimonialsGrid && Array.isArray(CONFIG.depoimentos)) {
        CONFIG.depoimentos.forEach((dep) => {
            const card = document.createElement("div");
            card.className = "testimonial-card";

            const stars = document.createElement("div");
            stars.className = "testimonial-stars";
            const notaSegura = Math.min(5, Math.max(1, Number(dep.nota) || 5));
            stars.textContent = "★".repeat(notaSegura) + "☆".repeat(5 - notaSegura);

            const texto = document.createElement("p");
            texto.className = "testimonial-text";
            texto.textContent = dep.texto || "";

            const autor = document.createElement("p");
            autor.className = "testimonial-author";
            autor.textContent = "— " + (dep.autor || "Cliente");

            card.appendChild(stars);
            card.appendChild(texto);
            card.appendChild(autor);
            testimonialsGrid.appendChild(card);
        });
    }

    // 8. Formulário de avaliação por estrelas + envio via WhatsApp
    const starEls = document.querySelectorAll("#star-rating .star");
    let selectedRating = 0;

    starEls.forEach((star) => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.getAttribute("data-value"), 10);
            starEls.forEach((s) => {
                s.classList.toggle("active", parseInt(s.getAttribute("data-value"), 10) <= selectedRating);
            });
        });
    });

    const feedbackSubmit = document.getElementById("feedback-submit");
    const feedbackTextarea = document.getElementById("feedback-text");

    if (feedbackSubmit) {
        feedbackSubmit.addEventListener("click", () => {
            const comentario = feedbackTextarea ? feedbackTextarea.value.trim() : "";
            const notaTexto = selectedRating > 0 ? "★".repeat(selectedRating) + "☆".repeat(5 - selectedRating) : "Não informada";

            const mensagemFeedback = "Olá! Gostaria de deixar uma avaliação sobre o serviço:\n" +
                "➢ Nota: " + notaTexto + "\n" +
                "➢ Comentário: " + (comentario || "(sem comentário)");

            const feedbackUrl = `https://wa.me/${CONFIG.telefone}?text=${encodeURIComponent(mensagemFeedback)}`;
            window.open(feedbackUrl, "_blank", "noopener,noreferrer");
        });
    }
});