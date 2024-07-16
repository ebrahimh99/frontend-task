let customers = [];  
let transactions = []; 
let transactionChart = null;


async function fetchData() {
  try {
    const customersResponse = await fetch("http://localhost:3000/customers");
    customers = await customersResponse.json();
    const transactionsResponse = await fetch("http://localhost:3000/transactions");
    transactions = await transactionsResponse.json();

    displayTable();
    updateChart();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayTable() {
  let transaction = [];
  let customer = [];
  let cartona = ''
  for (let i = 0; i < transactions.length; i++) {
    transaction.push(transactions[i]);
    for (let j = 0; j < customers.length; j++) {
      if (customers[j].id == transaction[i].customer_id) {
        customer.push(customers[j]);
        break;
      }
    }
    cartona += `
    <tr>
      <td> ${customer[i].name}</td>
      <td> ${transaction[i].date}</td>
      <td> ${transaction[i].amount}</td>
    </tr>
     `
  }
  $(".tbody").html(cartona)
  updateChart();

}

function filterByname() {

  const filterName = $("#filterName").val().toLowerCase(); 
  if (filterName === "") {
    $(".alert").addClass("d-none")
    return 0;
  }
  let customer = {};
  let transaction = [];
  for (let i = 0; i < customers.length; i++) {
    if (filterName == customers[i].name.toLowerCase()) {
      customer = customers[i]
    }
  }

  for (let j = 0; j < transactions.length; j++) {
    if (customer.id == transactions[j].customer_id) {
      transaction.push(transactions[j]);
    }
  }
  displayAfterFilterByName(customer, transaction)
 
}

function displayAfterFilterByName(customer, transaction) {
  if (customer.name != undefined) {
    $(".alert").addClass("d-none")
    let cartona = '';
    for (let i = 0; i < transaction.length; i++) {
      cartona += `
    <tr>
      <td> ${customer.name}</td>
      <td> ${transaction[i].date}</td>
      <td> ${transaction[i].amount}</td>
    </tr>
      `
    }
    $(".tbody").html(cartona)
  }
  else {
    fetchData();
    $(".alert").removeClass("d-none")
  }
  updateChart();
}


function filterByAmount() {
  const filterAmount = $("#filterAmount").val(); 
  if (filterAmount == '') {
    return 0;
  }
  else {
    let customer = [];
    let transaction = [];
    for (let i = 0; i < transactions.length; i++) {
      if (filterAmount >= transactions[i].amount) {
        transaction.push(transactions[i])
        customer.push(transactions[i].customer_id)
      }
    }
    var result = transaction.map(transaction => {
      var customer = customers.find(customer => customer.id == transaction.customer_id);
      return customer ? customer : {};
    });
    displayAfterFilterByAmount(result, transaction)
    console.log(result)
    console.log(transaction)

  }
}


function displayAfterFilterByAmount(result, transactionAmount) {
    let cartona = '';
    for (let i = 0; i < transactionAmount.length; i++) {
      cartona += `
    <tr>
      <td> ${result[i].name}</td>
      <td> ${transactionAmount[i].date}</td>
      <td> ${transactionAmount[i].amount}</td>
    </tr>
      `
    }
    $(".tbody").html(cartona)
    updateChart();
}



function extractTableData() {
  const tableData = {
    labels: [],
    data: []
  };
  $("#customerTable tbody tr").each(function() {
    const name = $(this).find("td").eq(0).text();
    const amount = $(this).find("td").eq(2).text();
    tableData.labels.push(name);
    tableData.data.push(amount);
  });
  return tableData;
}

function updateChart() {
  const tableData = extractTableData();
  const ctx = document.getElementById('transactionChart').getContext('2d');

  if (transactionChart) {
    transactionChart.destroy();
  }

  transactionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: tableData.labels,
      datasets: [{
        label: 'Transaction Amount',
        data: tableData.data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}



$(document).ready(function () {
  fetchData();
})

$("#submit-btn").click(function (event) {
  event.preventDefault();
  filterByname();
  filterByAmount()
});













// function displayChart(data) {
//   const transactionsPerDay = data.reduce((acc, transaction) => {
//     acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
//     return acc;
//   }, {});

//   const labels = Object.keys(transactionsPerDay);
//   const amounts = Object.values(transactionsPerDay);

//   new Chart(transactionChartCtx, {
//     type: 'bar',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: 'Total Transaction Amount',
//         data: amounts,
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });
// }
