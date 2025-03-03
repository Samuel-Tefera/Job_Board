const filterBox = document.querySelector(".filter-dropdown--container");
const filterDropdown = document.querySelector(".filter-dropdown");

const sortBox = document.querySelector(".sort-dropdown--container");
const sortDropdown = document.querySelector(".sort-dropdown");

const iconUpFilter = document.querySelector(".icon-up-filter");
const iconDownFilter = document.querySelector(".icon-down-filter");
const iconUpSort = document.querySelector(".icon-up-sort");
const iconDownSort = document.querySelector(".icon-down-sort");
// Card
const jobCard = document.querySelector(".job-cards--container");

const token = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");
const userType = localStorage.getItem("userType");

if (!token || !userId || !userType) {
  alert("You need to log in!");
  window.location.href = "login.html";
}

const myJobLink = document.querySelector(".my-jobs__link");
if (userType === "JF") {
  myJobLink.setAttribute("href", "myjobsseeker.html");
} else {
  myJobLink.setAttribute("href", "myjobsPoster.html");
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// Styles //////////////////////////////////////////////////////////////
const dropdown = function (dropdownBtn, iconUp, iconDown) {
  dropdownBtn.classList.toggle("dropdown__box--active");
  iconUp.classList.toggle("hide-icon");
  iconDown.classList.toggle("hide-icon");
};

const statusChangeColor = function (statusContent) {
  if (statusContent) {
    if (statusContent.textContent === "Accepted") {
      statusContent.classList.remove("status-reject");
      statusContent.classList.remove("status-pen");
      statusContent.classList.add("status-accept");
    }
    if (statusContent.textContent === "Rejected") {
      statusContent.classList.remove("status-accept");
      statusContent.classList.remove("status-pen");
      statusContent.classList.add("status-reject");
      return;
    }

    if (statusContent.textContent === "Pending") {
      statusContent.classList.remove("status-accept");
      statusContent.classList.remove("status-reject");
      statusContent.classList.add("status-pen");
      return;
    }
  }
};

const displayJobType = (type) => {
  if (type === "CT") return "Contractual";
  if (type === "FT") return "Full Time";
  if (type === "PT") return "Part Time";
};

const applicationStatus = (applications) => {
  const selectedApplication = applications.find(
    (application) => application.applicant === +userId
  );
  if (selectedApplication) {
    if (selectedApplication.status === "PND") return "Pending";
    if (selectedApplication.status === "REJ") return "Rejected";
    else return "Accepted";
  }
};

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

const displayJobs = function (data) {
  data.forEach(async function (job) {
    const html = ` <div class="job-cards">
          <div class="flex-container date">
            <span class="light-text date">Posted on</span>
            <span class="post-date date light-text">>${job.created_at}</span>
          </div>

          <h2 class="job-title card-text">${job.title}</h2>

          <div class="flex-container">
            <span class="job-category card-text">${job.job_category}</span>

            <div class="flex-container">
              <span class="card-text salary salary-type light-text"
                >Monthly -</span
              >
              <span class="salary-range salary card-text light-text">
                ${job.salary_range}</span
              >
            </div>

            <div class="flex-container double-container">
              <div class="flex-container icon--text">
                <ion-icon class="cards-icon" name="location-outline"></ion-icon>
                <span class="job-location card-text">${job.location}</span>
              </div>
              <div class="flex-container type">
                <span class="card-text type">Type -</span>
                <span class="job-type card-text">${displayJobType(
                  job.type
                )}</span>
              </div>
            </div>
          </div>

          <p class="description card-text">${job.description}</p>
          <div class="flex-container">
            <span class="light-text card-text">Status - </span>
            <span class="light-text card-text btn status-pen status"
              >${applicationStatus(job.applications)}</span
            >
          </div>
        </div>
        `;

    jobCard.insertAdjacentHTML("beforeend", html);

    // Change the background color of the status
    const statusContent = document.querySelector(".status");
    const newStatus = jobCard.lastElementChild.querySelector(".status");
    statusChangeColor(newStatus);
  });
};

const fetchJobs = async () => {
  try {
    const response = await fetch("http://localhost:8000/my-jobs/applied", {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    displayJobs(data);
  } catch (error) {
    alert("Something went wrong.");
  }
};

fetchJobs();
