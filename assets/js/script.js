document.addEventListener("DOMContentLoaded", async () => {
    const main = document.querySelector(".main-content");
    const sidebar = document.querySelector(".sidebar-inner");
    const headerLabel = document.querySelector(".header-label");
    const nextButton = document.getElementById("nextButton");
    const progressFill = document.getElementById("progressFill");

    let group = localStorage.getItem("group") || "1";
    let lang = localStorage.getItem("lang") || "en";
    localStorage.setItem("group", group);
    localStorage.setItem("lang", lang);

    const res = await fetch("/assets/data/questions.json");
    const questions = await res.json();
    let currentIndex = 0;

    async function loadQuestion(index) {
        const q = questions[index];
        if (!q) {
            const lang = localStorage.getItem("lang") || "en";
            window.location.href = `final.html`;
            return;
        }

        // Save q globally for template JS
        window.q = q;

        // Update header & progress
        headerLabel.textContent = `Question ${q.question} / ${questions[questions.length -1].question}`;
        progressFill.style.width = `${(index / questions.length) * 100}%`;

        // Load main template
        templateUrl = "";
        if(q.type == "review"){
          templateUrl = `/assets/templates/${q.type}-${lang}.html`;
        }
        else{
          templateUrl = `/assets/templates/group-${group}/${q.type}-${lang}.html`;
        }
        try {
            const templateRes = await fetch(templateUrl);
            main.innerHTML = await templateRes.text();
        } catch (err) {
            main.innerHTML = `<p>Error loading template: ${err.message}</p>`;
            return;
        }

        // Build sidebar from JSON
        let sidebarHtml = `<h2>${q.title}</h2>`;
        if (q.sidebar?.instructions) {
            sidebarHtml += `<p>${q.sidebar.instructions}</p>`;
        }

        // Multiselect
        if (q.sidebar?.select) {
            sidebarHtml += `
            <label for="actors">${q.sidebar.select.title}:</label>
            <select id="actors" name="actors" multiple="multiple">
                ${q.sidebar.select.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
            <button id="submitTask">Submit Task</button>
            `;
        }

    sidebar.innerHTML = sidebarHtml;

    var multi = document.getElementById("actors");

    if(multi) {
      new TomSelect("#actors", {
        plugins: ['remove_button'],
      });
    }
      
    // Show/hide submit button
    const sidebarSubmit = document.getElementById("submitTask");
    if (!sidebarSubmit) {
      // No multiselect → hide button
      if (document.getElementById("submitTask")) {
        document.getElementById("submitTask").style.display = "none";
      }
    } else {
      sidebarSubmit.onclick = () => {
        nextButton.disabled = false;
        const data = {};
        for(i = 0; i < multi.selectedOptions.length; i++){
          data[i] = multi.selectedOptions[i].value;
        }
        localStorage.setItem(`question-${q.question}`, JSON.stringify(data));
      };
    }

    const script = document.createElement("script");

    if(q.type == "review"){
      script.src = `/assets/templates/${q.type}.js`;
    }
    else{ 
      script.src = `/assets/templates/group-${group}/${q.type}.js`;
    }
    main.appendChild(script);
  }

  nextButton.addEventListener("click", () => {
    currentIndex++;
    nextButton.disabled = true;
    loadQuestion(currentIndex);
  });

  // Initial load
  loadQuestion(currentIndex);
});