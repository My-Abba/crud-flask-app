const API_URL = 'http://127.0.0.1:5000/api/items';
const form = document.getElementById('form-item');
const btnCancelar = document.getElementById('btn-cancelar');
const inputId = document.getElementById('item-id');
const inputNombre = document.getElementById('nombre');
const inputDescripcion = document.getElementById('descripcion');
const tabla = document.getElementById('lista-items');

// Escapar caracteres HTML
const escapeHTML = str => str.replace(/&/g, '&amp;')
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

// Manejar formulario
form.addEventListener('submit', async e => {
  e.preventDefault();
  
  const data = {
    nombre: inputNombre.value.trim(),
    descripcion: inputDescripcion.value.trim()
  };

  try {
    const response = await fetch(inputId.value ? `${API_URL}/${inputId.value}` : API_URL, {
      method: inputId.value ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la operación');
    }
    
    resetForm();
    await fetchItems();
    
  } catch (error) {
    alert(error.message);
  }
});

// Cancelar edición
btnCancelar.addEventListener('click', resetForm);

// Resetear formulario
function resetForm() {
  inputId.value = '';
  inputNombre.value = '';
  inputDescripcion.value = '';
  btnCancelar.style.display = 'none';
}

// Obtener items
async function fetchItems() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al cargar items');
    
    const items = await res.json();
    renderItems(items);
    
  } catch (error) {
    alert(error.message);
  }
}

// Renderizar tabla
function renderItems(items) {
  tabla.innerHTML = items.map(item => `
    <tr>
      <td>${escapeHTML(item.nombre)}</td>
      <td>${escapeHTML(item.descripcion)}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1" 
          onclick="editItem('${item.id}', '${escapeHTML(item.nombre)}', '${escapeHTML(item.descripcion)}')">
          Editar
        </button>
        <button class="btn btn-sm btn-danger" 
          onclick="deleteItem(${item.id})">
          Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}

// Editar item
window.editItem = (id, nombre, descripcion) => {
  inputId.value = id;
  inputNombre.value = nombre;
  inputDescripcion.value = descripcion;
  btnCancelar.style.display = 'inline-block';
};

// Eliminar item
window.deleteItem = async id => {
  if (!confirm('¿Confirmar eliminación?')) return;
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
    if (!response.ok) throw new Error('Error al eliminar');
    await fetchItems();
    
  } catch (error) {
    alert(error.message);
  }
};

// Inicializar
window.onload = fetchItems;