<script>
  import {collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc} from 'firebase/firestore';
  import {db} from './firebase.js';
  import {onDestroy} from "svelte";
  import Toastify from 'toastify-js';

  let task = {
    title: '',
    description: '',
  };

  let tasks = [];
  let updateTask = false;
  let buttonText = 'Create';
  let currentId = '';

  function handleSubmit() {
    !updateTask ? handleCreate() : handleUpdate(currentId);
  }

  async function handleCreate() {
    try {
      await addDoc(collection(db, 'tasks'), {...task, createdAt: new Date()});
      task = {
        title: '',
        description: '',
      };
      Toastify({
        text: 'Task created',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#04ab43',
        stopOnFocus: true,
      }).showToast();
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDelete(id) {

    try {
      await deleteDoc(doc(db, 'tasks', id));
      Toastify({
        text: 'Task deleted',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#fa2929',
        stopOnFocus: true,
      }).showToast();
    } catch (e) {
      console.log(e);
    }
  }

  async function handleUpdate(id) {
    try {
      await updateDoc(doc(db, 'tasks', id), task);
      updateTask = false;
      buttonText = 'Create';
      task = {
        title: '',
        description: '',
      };
      Toastify({
        text: 'Task updated',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#01625c',
        stopOnFocus: true,
      }).showToast();
    } catch (e) {
      console.log(e);
    }
  }

  function handleEdit(currentTask) {
    try {
      currentId = currentTask.id;
      task.title = currentTask.title;
      task.description = currentTask.description;
      buttonText = 'Update';
      updateTask = true;
      return 0;
    } catch (e) {
      return 1;
    }

  }

  const unsub = onSnapshot(collection(db, 'tasks'),
    (snapshot) => {
      tasks = snapshot.docs.map(doc => {
        return {id: doc.id, ...doc.data()};
      });
    }, (err) => {
      console.log(err);
    });

  onDestroy(unsub);
</script>

<main>
  <form on:submit|preventDefault={handleSubmit}>
    <label for="title">Title</label>
    <input
      bind:value={task.title}
      type="text"
      id="title"
      placeholder="Write a Title"/>
    <label for="description">Description</label>
    <textarea
      bind:value={task.description}
      id="description"
      rows="3"
      placeholder="Write a Description"></textarea>
    <input type="submit" value={buttonText}
           style="background: #04ab43; color: #fff; font-weight: bold"/>
  </form>
  <div class="tasks">
    {#each tasks as task}
      <div class="task">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <button on:click={handleDelete(task.id)} style="font-weight: bold; background: #fa2929; color: white">Delete
        </button>
        <button on:click={handleEdit(task)} style="font-weight: bold; background: #01625c; color: white">Edit</button>
      </div>
    {/each}
  </div>
</main>

<style>
  form {
    border: 1px solid #ccc;
    width: fit-content;
    padding: 30px;
    margin: 50px auto;
    height: fit-content;
  }

  form label {
    font-weight: bold;
  }

  form input,
  textarea {
    display: block;
    font-family: inherit;
    padding: 5px 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
  }

  .tasks {
    width: 95%;
    margin: 0 auto;
    padding: 20px;
  }

  .task {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  .tasks button {
    font-family: inherit;
    padding: 5px 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
  }

  @media (min-width: 768px) {
    main {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    form {
      grid-column: 1;
    }

    .tasks {
      grid-column: 2;
    }
  }
</style>
