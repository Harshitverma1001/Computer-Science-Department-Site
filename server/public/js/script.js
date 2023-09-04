function showSection(sectionId) {
        const sections = ["home", "about", "courses", "faculties", "notices"];
        // const sections = ["about", "courses", "faculties", "notices"];
        for (let i = 0; i < sections.length; i++) {
          const section = document.getElementById(sections[i]);
          if (sections[i] === sectionId) {
            section.style.display = "block";
          } else {
            section.style.display = "none";
          }
        }
      }
       
      // Wrap the JavaScript code inside a DOMContentLoaded event listener
  document.addEventListener('DOMContentLoaded', () => {
    // Get all buttons with class "profileView"
    const profileViewButtons = document.querySelectorAll('.profileView');

    // Add event listeners to each button
    profileViewButtons.forEach((button) => {
      button.addEventListener('click', () => {
        // Get the faculty ID from the data attribute
        const facultyId = button.dataset.facultyId;
        // Redirect the user to the /faculty/:id route with the corresponding faculty ID
        window.location.href = `/faculty/${facultyId}`;
      });
    });
  });


      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty1").addEventListener("click", function() {
          window.location.href = "faculty1.ejs";
        });
      });
      

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty2").addEventListener("click", function() {
          window.location.href = "faculty2.ejs";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty3").addEventListener("click", function() {
          window.location.href = "faculty3.html";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty4").addEventListener("click", function() {
          window.location.href = "faculty4.html";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty5").addEventListener("click", function() {
          window.location.href = "faculty5.html";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty6").addEventListener("click", function() {
          window.location.href = "faculty6.html";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty7").addEventListener("click", function() {
          window.location.href = "faculty7.html";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty8").addEventListener("click", function() {
          window.location.href = "faculty8.html";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty9").addEventListener("click", function() {
          window.location.href = "faculty9.html";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty10").addEventListener("click", function() {
          window.location.href = "faculty10.html";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty11").addEventListener("click", function() {
          window.location.href = "faculty11.html";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty12").addEventListener("click", function() {
          window.location.href = "faculty12.html";
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("faculty13").addEventListener("click", function() {
          window.location.href = "faculty13.html";
        });
      });