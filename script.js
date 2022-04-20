"use strict";

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
  
};
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_client")) ?? [];
const setLocalStorage = (dbClient) =>
  localStorage.setItem("db_client", JSON.stringify(dbClient));

//CRUD
const createClient = (client) => {
  const dbClient = getLocalStorage();
  dbClient.push(client);
  setLocalStorage(dbClient);
};
const readClient = () => getLocalStorage();

const updateClient = (index, client) => {
  const dbClient = readClient();
  dbClient[index] = client;
  setLocalStorage(dbClient);
};
const deleteClient = (index) => {
  const dbClient = readClient();
  dbClient.splice(index, 1);
  setLocalStorage(dbClient);
};
const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};
//Interação
const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((element) => {
    element.value = "";
  });
};

const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      celular: document.getElementById("celular").value,
      cidade: document.getElementById("cidade").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index == "new") {
      createClient(client);
      updateTable();
      closeModal();
    } else {
      updateClient(index, client);
      updateTable();
      closeModal();
    }
  }
};
const cancelClient = () => {
  closeModal();
};

const createRow = (client, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
  <td>${client.nome}</td>
  <td>${client.email}</td>
  <td>${client.celular}</td>
  <td>${client.cidade}</td>
  <td>
  <button type="button" class="button green" id="edit-${index}">Editar</button>
  <button type="button" class="button red" id="delete-${index}">Excluir</button>
  </td>
  `;
  document.querySelector("#tableCliente>tbody").appendChild(newRow);
};
const updateTable = () => {
  //document.getElementById("title").innerText = "Novo Cliente";
  const dbClient = readClient();
  clearTable();
  dbClient.forEach(createRow);
};
const clearTable = () => {
  const rows = document.querySelectorAll("#tableCliente>tbody tr");
  console.log(rows)
  rows.forEach((row) => row.parentNode.removeChild(row));
};
const preencherFields = (client) => {
  document.getElementById("title").innerText = "Editar Cliente";
  document.getElementById("nome").value = client.nome;
  document.getElementById("email").value = client.email;
  document.getElementById("cidade").value = client.cidade;
  document.getElementById("celular").value = client.celular;
  document.getElementById("nome").dataset.index = client.index;
};

const editClient = (index) => {
  const client = readClient()[index];
  client.index = index;
  //document.getElementById("title").innerText = "Editar Cliente";
  preencherFields(client);
  openModal();
};
const editDeleteRow = (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");
    if (action == "edit") {
      editClient(index);
    } else {
      const client = readClient()[index];
      const response = confirm(
        `Deseja realmente excluir o cliente ${client.nome}`
      );
      if (response) {
      deleteClient(index);
      updateTable();
    }
  }
}
};

//Eventos
updateTable();
document
  .getElementById("cadastrarCliente")
  .addEventListener("click", openModal);
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("salvar").addEventListener("click", saveClient);
document.getElementById("cancelar").addEventListener("click", cancelClient);
document
  .querySelector("#tableCliente>tbody")
  .addEventListener("click", editDeleteRow);
