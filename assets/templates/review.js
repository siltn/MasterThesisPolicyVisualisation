// review.js
(function() {
  const radios = document.querySelectorAll('input[name="rating"]');
  const nextBtn = document.getElementById("nextButton");

  radios.forEach(radio => {
      radio.addEventListener("change", (event) => {
        localStorage.setItem(`review-${q.question}`, event.target.value);
        if (nextBtn) nextBtn.disabled = false;
      });
  });

})();
