const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.add-form')
const inputTask = document.querySelector('.input')

const fetchTasks = async () => {
    const response = await fetch('http://localhost:3333/tasks')
    const tasks = await response.json()
    return tasks
}

const addTask = async (event) => {
    event.preventDefault();
  
    const task = { title: inputTask.value };
  
    const post = await fetch('http://localhost:3333/new', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    
    console.log(post.json())
    
    inputTask.value = '';
}

const deleteTask = async (id) => {
    alert('delete task: ' + id)

    await fetch(`http://localhost:3333/tasks/${id}`,{
        method: 'delete'
    })
    loadTasks()

}

const updateTask = async (task) => {

    const {id, nome, status } = task

    await fetchTasks(`http:localhost:3333/tasks/${id}`,{
        method: 'put',
        headers: { 'Content-Type':'application/json'},
        body: JSON.stringify({title: nome, status:status})
    })
    loadTasks()
}


const createElement = (tag, inner='',_HTML='') => {
    const element = document.createElement(tag)
    
    if(inner)
    {
        element.innerText = inner
    }
    if(_HTML)
    {
        element.innerHTML = _HTML
    }

    return element
}



const createSelect = (value) => {
    const options = `<option>Pendente</option>
    <option>Em Andamento</option>
    <option>Concluída</option>`
    const select = createElement('select','',options)
    select.value = value
    return select
}


const createRow = (task) => {
    const { id, nome, created_at,status } = task

    const tr = createElement('tr')
    const tdTitle = createElement('td',nome)
    const tdCreated_at = createElement('td',formatDate(created_at))
    const tdStatus = createElement('td')
    const tdActions = createElement('td')

    const select = createSelect(status)

    select.addEventListener('change', ({target}) => 
    {
        updateTask({id, nome, status})
    })

    const editButton = createElement('button','','<span class="material-symbols-outlined">edit</span>')
    const deleteButton = createElement('button','','<span class="material-symbols-outlined">delete</span>')

    deleteButton.addEventListener('click', () => {
        deleteTask(id)
    })

    editButton.classList.add('btn-action')
    deleteButton.classList.add('btn-action')

    tdStatus.appendChild(select)

    tdActions.appendChild(editButton)
    tdActions.appendChild(deleteButton)

    tr.appendChild(tdTitle)
    tr.appendChild(tdCreated_at)
    tr.appendChild(tdStatus)
    tr.appendChild(tdActions)
    
    return tr;
}

const formatDate = (dateUTC) => {
    const options = {dateStyle: 'long', timeStyle: 'short'}
    const date = new Date(dateUTC).toLocaleString('pt-br', options)
    return date
}

const loadTasks = async () => {
    let tasks = await fetchTasks()
    tbody.innerHTML = '';
    tasks.forEach((row) => {
        let trTask = createRow(row)
        tbody.appendChild(trTask)
    })
}



loadTasks();

addForm.addEventListener('submit', addTask);
