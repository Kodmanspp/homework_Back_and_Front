const ENDPOINT = "http://localhost:3000";

const container = document.querySelector(".trainers__container");
const overflow = document.querySelector(".overflow");
const createTrainers_btn = document.querySelector(".create-trainers");


const getData = async (route) => {
    await closeModal(overflow);
    const data = await fetch(`${ENDPOINT}/${route}`);
    return await data.json();

}

const deleteData = async (route) => {
    return await fetch(ENDPOINT + "/" + route, {
        method: 'delete'
    })
}

const createData = async (route, data) => {
    return await fetch(`${ENDPOINT}/${route}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
}

const updateData = async(route, data, id)=>{
    return await fetch(`${ENDPOINT}/${route}/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
}

const createElement = (tag, className, text, innerHTML) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

const createTrainers = (inputs) => async () => {
    if (validInputs(inputs)) {
        const body = {
            name: inputs[0].value,
            age: inputs[1].value,
            specialization: inputs[2].value,
            salary: inputs[3].value,
        }
        createData("trainers/create", body);
        getData("trainers").then(renderItems);
    }
};

const updateTrainers = (id, inputs) => async () => {
    if (validInputs(inputs)) {
        const body = {
            name: inputs[0].value,
            age: inputs[1].value,
            specialization: inputs[2].value,
            salary: inputs[3].value,
        }
        updateData(`trainers/update`, body, id);
        getData("trainers").then(renderItems);
    }
};
const updateTrainersModal = (id) => ()=> {
    
    const overflow = document.querySelector(".overflow");
    const modalContent = document.querySelector(".modal__content");
    modalContent.innerHTML = "";
    modalContent.classList.add("input__modal");

    const modalClose = createElement("button", "modal__close", "Закрыть");
    const form = createElement("form", "input-form");
    const itemName = createElement("input", `input-name`,);
    const age = createElement("input", "input-age");
    const itemSpec = createElement("input", `input__spec`,);
    const salary = createElement("input", "input__salary");
    const submit = createElement("input", "submit", "Submit");
    submit.type = "button";
    submit.value ="UPDATE"
    itemName.type = "text";
    age.type = "number"; 
    salary.type = "number"; 

    itemName.placeholder = "Name";
    age.placeholder = "Age";
    itemSpec.placeholder = "Specialization";
    salary.placeholder = "Salary";

    const inputs = [itemName, age, itemSpec, salary];


    form.append(itemName, age, itemSpec, salary, submit);
    modalContent.append(modalClose, form);

    openModal(overflow);

    modalClose.addEventListener("click", closeModal(overflow));

    submit.addEventListener("click", updateTrainers(id, inputs));
    

}
const createTrainersModal = () => {

    const overflow = document.querySelector(".overflow");
    const modalContent = document.querySelector(".modal__content");
    modalContent.innerHTML = "";
    modalContent.classList.add("input__modal");

    const modalClose = createElement("button", "modal__close", "Закрыть");
    const form = createElement("form", "input-form");
    const itemName = createElement("input", `input-name`,);
    const age = createElement("input", "input-age");
    const itemSpec = createElement("input", `input__spec`,);
    const salary = createElement("input", "input__salary");
    const submit = createElement("input", "submit", "Submit");
    submit.type = "button";
    itemName.type = "text";
    age.type = "number"; 
    salary.type = "number"; 
    submit.value ="CREATE"

    itemName.placeholder = "Name";
    age.placeholder = "Age";
    itemSpec.placeholder = "Specialization";
    salary.placeholder = "Salary";

    const inputs = [itemName, age, itemSpec, salary];


    form.append(itemName, age, itemSpec, salary, submit);
    modalContent.append(modalClose, form);

    openModal(overflow);

    modalClose.addEventListener("click", closeModal(overflow));
    submit.addEventListener("click", createTrainers(inputs));
}

const renderModal = (data) => async () => {
    const { id } = data;

    const element = await getData(`trainers/${id}`);

    const modalContent = document.querySelector(".modal__content");
    const overflow = document.querySelector(".overflow");

    modalContent.innerHTML = "";

    const modalClose = createElement("button", "modal__close", "Закрыть");
    const itemName = createElement("h4", `trainers__name`, `Имя: ${element.name}`);
    const age = createElement("p", "trainers__age", element.age);
    const itemSpec = createElement("p", `trainers__spec`, `Специальность: ${element.specialization}`);
    const salary = createElement("p", "trainers__salary", element.salary);
    const elementDelete = createElement("button", "trainers__delete", "DELETE");
    const elementRemove = createElement("button", "trainers__remove", "REMOVE");
    modalContent.append(modalClose, itemName, age, itemSpec, salary, elementDelete, elementRemove);

    openModal(overflow);
    modalClose.addEventListener("click", closeModal(overflow));

    elementDelete.addEventListener("click", async () => {
        await deleteData(`trainers/delete/${id}`)
        await getData("trainers").then(renderItems);
    });

    elementDelete.addEventListener("click", closeModal(overflow));
    elementRemove.addEventListener("click", updateTrainersModal(id));

}

const renderItems = (items) => {
    container.innerHTML = "";
    items.forEach(element => {
        const itemContainer = createElement("div", "trainers__item");
        const itemDiv = createElement("div", "trainers_data");

        const itemName = createElement("h4", `trainers__name`, `Имя: ${element.name}`);
        const itemSpec = createElement("p", `trainers__spec`, `Специальность: ${element.specialization}`);

        itemContainer.addEventListener("click", renderModal(element));
        itemDiv.append(itemName, itemSpec);
        itemContainer.append(itemDiv);

        container.append(itemContainer);

    });
}

const openModal = (overflow) => {
    overflow.style.opacity = 1;
    overflow.style.visibility = "inherit";
}

const closeModal = (overflow) => () => {
    overflow.style.opacity = 0;
    overflow.style.visibility = "hidden";
    document.querySelector(".modal__content").innerHTML = "";
}
const validInputs = (inputs) => {
    let flag = true;
    inputs.forEach(item => {

        if (!item || item.value.trim().length === 0) {
            item.value = "";
            item.placeholder = "not value";
            flag = false;
        }
        else {
            item.value = item.value.replace(/\s/g, '');
        }
    })
    if (flag === true) {
        getData("trainers").then(renderItems);
        
    }
    return flag;
}
createTrainers_btn.addEventListener("click", createTrainersModal);
getData("trainers").then(renderItems);

