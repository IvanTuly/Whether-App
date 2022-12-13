//как только страница загрузится
window.addEventListener('load', () => {
    //получаем форму по id, поэтому пишем #
    const form = document.querySelector('#new-task-form');
    //получаем введенные данные задачи
    const input = document.querySelector('#new-task-input');
    //получаем задачи, куда будем добавлять новые
    const list_el = document.querySelector('#tasks');

    //отправка нашей задачи в html, с обновлением страницы по кнопке add task, type = submit   
    form.addEventListener('submit', (e) => {
        //???????????????????
        e.preventDefault();

        //данные, что мы написали в задачу, прим: (Встать в 7:00)
        const task = input.value;
        //проверка на пустоту вводимых данных
        if (!task) {
            //если нет данных выводим alert
            alert("Please fill out the task");
            return;
        }

        //создаем новый элемент div, в котором будем хранить задачу и кнопки редактировать и удалить
        const task_el = document.createElement('div');
        //даем нашему элементу div класс = 'task'
        task_el.classList.add("task");

        //создаем новый элемент div, чтобы хранить в нем нашу задачу и наздачаем класс content
        const task_content_el = document.createElement('div');
        task_content_el.classList.add("content");

        //добавляем div.content в div.task как дочерний элемент, div внутри div
        task_el.appendChild(task_content_el);

        //создаем элемент input и задаем ему класс = text, и значение наши данные задачи, устанавливаем режим только чтение. 
        const task_input_el = document.createElement('input');
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = task;
        task_input_el.setAttribute("readonly", "readonly");

        //добавляем наш input в div.content, как дочерний элемент
        task_content_el.appendChild(task_input_el);

        //создаем элемент div и назначаем ему класс = actions, в который будем помещать дочерние элементы "редактировать" и "удалить"
        const task_actions_el=document.createElement("div");
        task_actions_el.classList.add("actions");

        //создаем кнопку button и назначаем класс = edit
        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        //вставляем видимое название кнопки в html код
        task_edit_el.innerHTML = "Edit";

        //аналогичная кнопка для удаления с классом = delete
        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "Delete";

        //добавляем кнопки как дочерние элементы в div с классом task_actions_el
        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        //добавляем div.task_actions_el с кнопками edit и delete как дочерний элемент в контейнер задачи div.task_el
        task_el.appendChild(task_actions_el);

        //добавляем нашу задачу внутрь списка задач, помещаем div внутрь div
        list_el.appendChild(task_el);

        //сбрасываем данные, которые были в строке ввода задачи
        input.value = "";

        //делаем кнопку edit, по клику на нее будет выполняться:
        task_edit_el.addEventListener("click", () => {
            //если кнопка с надписью edit, то позволяем редактировать, если кнопка с надписью save, то сохраняем данные
            if (task_edit_el.innerText.toLowerCase() == "edit") {
                //убираем атрибут, который блокирует редактирование input
                task_input_el.removeAttribute("readonly");
                //визуальный эфект фокусировки на элементе ввода текста
                task_input_el.focus();
                //меняем надпись на "save"
                task_edit_el.innerText = "Save";
            } else {
                //блокируем редактирование input
                task_input_el.setAttribute("readonly", "readonly");
                //меняем надпись на "edit"
                task_edit_el.innerText = "Edit";
            }
        });

        //по клику на кнопку delete удаляем элемент
        task_delete_el.addEventListener("click", () => {
            list_el.removeChild(task_el);

        });
    });
});