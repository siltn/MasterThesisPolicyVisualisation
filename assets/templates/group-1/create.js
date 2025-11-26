// create-loaddata.js
(function () {
  if (!window.q || !q.body) return;

  const body = q.body;

  // Fill inputs by ID
  for (const fieldId in body) {
    const el = document.getElementById(fieldId);
    if (!el) continue;

    if (el.tagName === "INPUT") {
      if (el.type === "checkbox") {
        el.checked = Boolean(body[fieldId]);
      } else if (el.type === "datetime-local") {
        el.value = body[fieldId];
      } else {
        el.value = body[fieldId];
      }
    } else if (el.tagName === "TEXTAREA") {
      el.value = body[fieldId];
    } else if (el.tagName === "SELECT") {
      el.value = body[fieldId];
    }
  }

  // Policy type logic
  const typeSwitch = document.getElementById("policyType");
  typeSwitch.addEventListener("change", togglePolicyType);

  function togglePolicyType() {
    const provider = document.getElementById("provider");
    const consumer = document.getElementById("consumer");

    if(typeSwitch.value == "Offer"){
        provider.style.display = "";
        provider.setAttribute("required", "true");

        consumer.style.display = "none";
        consumer.removeAttribute("required");
    }
    else if (typeSwitch.value == "Contract"){
        provider.style.display = "none";
        provider.removeAttribute("required");

        consumer.style.display = "";
        consumer.setAttribute("required", "true");
    }
    else{
        provider.style.display = "";
        provider.setAttribute("required", "true");

        consumer.style.display = "";
        consumer.setAttribute("required", "true");
    }
  }

  togglePolicyType();

  // Optional Fields logic
  function bindToggle(checkboxId, inputId) {
    const check = document.getElementById(checkboxId);
    const input = document.getElementById(inputId);
    if (!check || !input) return;

    const update = () => {
      if (check.checked) {
        input.style.display = "inline-block";
        input.setAttribute("required", "true");
      } else {
        input.style.display = "none";
        input.removeAttribute("required");
      }
    };

    check.addEventListener("change", update);
    update(); // initialize
  }

  bindToggle("useApplication", "Application");
  bindToggle("useConnector", "Connector");
  bindToggle("useUsage", "Usage");
  bindToggle("useDuration", "Duration");
  bindToggle("useDuration", "DurationYear");
  bindToggle("useDuration", "DurationMonth");
  bindToggle("useDuration", "DurationDay");
  bindToggle("useDuration", "DurationHour");
  bindToggle("useStartTime", "StartTime");
  bindToggle("useEndTime", "EndTime");
  bindToggle("useEvent", "Event");
  bindToggle("useLocation", "Location");
  bindToggle("usePurpose", "Purpose");

  // Submit Form logic
  document.getElementById("policyForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const data = {};
    const requiredFields = form.querySelectorAll("[required]");

    for(const input of requiredFields){
      console.log(input.value);
      console.log(input.id);
      data[input.id] = input.value;
    }
    localStorage.setItem(`question-${q.question}`, JSON.stringify(data));

    const policyTranslation = document.getElementById("policyTranslation");
    policyTranslation.style.display = "block"

    const nextBtn = document.getElementById("nextButton");
    if (nextBtn) nextBtn.disabled = false;

  });

})();
