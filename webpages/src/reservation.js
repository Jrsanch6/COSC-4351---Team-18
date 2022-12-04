const body = document.getElementById("body");

// async function get_available_tables() {
//     const response = await fetch('/requests/availableTables', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application.json'
//         },
//         body: JSON.stringify()
//     })
//     return response.json();
// }

async function get_available_tables_in_table(data) {
    const response = await fetch('/requests/availableTables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

async function reserve_guest(data) {
    const response = await fetch('/requests/reserve_guest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

// Need code to handle if no cookie stored for user
dc = document.cookie;
const start_idx = dc.indexOf('UserID')
const end_idx = dc.substr(start_idx).indexOf(';');
let user_id;
if (end_idx === -1) {
    user_id = parseInt(dc.substr(start_idx+7));
}
else {
    user_id = parseInt(dc.substr(start_idx+7, end_idx));
}

//check if the cookie is existed
if ( document.cookie.indexOf('UserID') != -1){
    window.location.href = "/reservationRegistered";
  }

function insert_table_button() {
    const Newbutton = document.createElement('button');
    Newbutton.textContent = 'Reserve';
    return Newbutton;
}


// const tables_list = document.getElementById("tables_list");

// get_available_tables().then(getAvailableTables_results => {
//     for (const table_info of getAvailableTables_results.Info) {
//         const li = document.createElement('li');
//         const unique_id = table_info.TableID.toString();

//         li.setAttribute('id', unique_id);

//         const body = `Table Number: ${table_info.TableID} Capacity: ${table_info.Capacity}\t`
//         li.innerHTML = body;

//         tables_list.appendChild(li);
//     }
// }); 


const available_tables_list = document.getElementById('available_tables_list');
const date = document.getElementById('date');

// date.addEventListener('change', () => {
//     //display available tables on specific date
//     const firstName = document.getElementById("firstName");
//     const lastName = document.getElementById("lastName");
//     const address = document.getElementById("address");
//     const seats = document.getElementById("seats");

//     get_available_tables_in_table({Date: date.value}).then(getAvailableTables_results => {
//         var newDate;
//         for (const table_date of getAvailableTables_results.Dates){
//             newDate = table_date.WEEKDAY.toString();
//         }

//         //Create a HTML Table element.
        
//         var table = document.createElement("TABLE");
//         table.border = "1";

//         var customers = new Array();
//         customers.push(["Table Number", "Capacity", "Action"]);

//         //Add the header row.
//         var row = table.insertRow(-1);
//         for (var i = 0; i < 3; i++) {
//             var headerCell = document.createElement("TH");
//             headerCell.innerHTML = customers[0][i];
//             row.appendChild(headerCell);
//         }

//         //Add the data rows.
//         for (const table_info of getAvailableTables_results.Info) {
//             row = table.insertRow(-1);
//             var cell = row.insertCell(-1);
//             cell.innerHTML = table_info.TableID.toString();
//             cell = row.insertCell(-1);
//             cell.innerHTML = table_info.Capacity;
//             const unique_id = table_info.TableID.toString();
//             cell = row.insertCell(-1);
//             const insertTableButton = insert_table_button();
//             cell.appendChild(insertTableButton);
//             insertTableButton.addEventListener('click', () => {
//                 if(getAvailableTables_results.Info.length <=  2 || newDate == 4 || newDate == 5 || newDate == 6 || getAvailableTables_results.Holiday == true){
//                     alert("High Traffic Day: No show will have minimum $10 charge. Please register with a valid credit card to reserve this date");
//                     window.location.href = "/register";
//                 }
//                 else{
//                 reserve_guest({TableID: table_info.TableID, Date: date.value, FirstName: firstName.value, LastName: lastName.value, Address: address.value}).then(reserve_guest_results => {
//                     // song_info: {id, title, rating}
//                     if(reserve_guest_results.Accepted == true){
//                         alert(`Table Reserved`);
//                         window.location.reload();
//                     }
//                     else{
//                         alert(`An Error Has Occurred, Try Again`);
//                         window.location.reload();
//                     }
//                 });
//             }
//             });
//         }

//         available_tables_list.innerHTML = "";
//         available_tables_list.appendChild(table);
//     });
// });

date.addEventListener('change', () => {
    //display available tables on specific date
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const address = document.getElementById("address");
    const seats = document.getElementById("seats");

    const container = document.getElementById('container');

    get_available_tables_in_table({Date: date.value}).then(getAvailableTables_results => {
        container.innerHTML = "";
        var newDate;
        for (const table_date of getAvailableTables_results.Dates){
            newDate = table_date.WEEKDAY.toString();
        }

        //Add the data rows.
        for (const table_info of getAvailableTables_results.Info) {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = table_info.TableID.toString();
            checkbox.name = table_info.Capacity;
            checkbox.value = table_info.Capacity;
         
            var label = document.createElement('label')
            label.htmlFor = 'Table: ';
            label.appendChild(document.createTextNode("Table: " + table_info.TableID.toString() + " Capacity: " + table_info.Capacity));
         
            var br = document.createElement('br');
         
            
            container.appendChild(checkbox);
            container.appendChild(label);
            container.appendChild(br);
        }
        const insertTableButton = insert_table_button();
        insertTableButton.id = "InsertCheckbox";
        container.appendChild(insertTableButton);
        insertTableButton.addEventListener('click', () => {
            if(getAvailableTables_results.Info.length <=  2 || newDate == 4 || newDate == 5 || newDate == 6 || getAvailableTables_results.Holiday == true){
                alert("High Traffic Day: No show will have minimum $10 charge. Please register with a valid credit card to reserve this date");
                window.location.href = "/register";
            }
            else{
                for(const table_info of getAvailableTables_results.Info){
                    var doc = document.getElementById(table_info.TableID.toString());

                    if(doc.checked == true){
                    

                    reserve_guest({TableID: table_info.TableID, Date: date.value, FirstName: firstName.value, LastName: lastName.value, Address: address.value}).then(reserve_guest_results => {
                        // song_info: {id, title, rating}
                        if(reserve_guest_results.Accepted == true){
                            alert(`Table Reserved`);
                            window.location.reload();
                        }
                        else{
                            alert(`An Error Has Occurred, Try Again`);
                            window.location.reload();
                        }
                    });
                }
                }
        }
        });
    });
});