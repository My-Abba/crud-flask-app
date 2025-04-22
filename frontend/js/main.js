// main.js: Lógica para comunicarse con el backend y actualizar el DOM
 
// URL base del API Flask
const API_URL = 'http://localhost:5000/api/items';
 
// 1. Obtener y mostrar items
async function fetchItems() {
  try {
    const res = await fetch(API_URL);             // Llama GET /api/items
    const items = await res.json();                // Convierte respuesta a JSON
    const tbody = document.getElementById('lista-items');
    tbody.innerHTML = '';                          // Limpia la tabla
 
    items.forEach(i => {                           // Recorre cada item
      tbody.innerHTML += `                        // Añade una fila
        <tr>
          <td>${i.nombre}</td>
          <td>${i.descripcion}</td>
          <td>
            <button xx="edit(${i.id}, '${escapeJS(i.nombre)}', '${escapeJS(i.descripcion)}')" class="btn btn-sm btn-warning me-1">Editar</button>
            <button xx="del(${i.id})" class="btn btn-sm btn-danger">Eliminar</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error('Error al cargar items:', err);
  }
}
 
// 2. Manejo del formulario (crear o actualizar)
document.getElementById('form-item').addEventListener('submit', async e => {
  e.preventDefault();
 
  const id = document.getElementById('item-id').value;
  const nombre = document.getElementById('nombre').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const method = id ? 'PUT' : 'POST';            // Decide método HTTP
  const url = id ? `${API_URL}/${id}` : API_URL;  // URL con o sin id
 
  // Prepara payload
  const payload = { nombre, descripcion };
  
  try {
    await fetch(url, {
      method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    resetForm();      // Limpia el formulario
    fetchItems();     // Refresca la lista
  } catch (err) {
    console.error('Error al guardar:', err);
  }
});
 
// 3. Función para iniciar edición
function edit(id, nombre, descripcion) {
  document.getElementById('item-id').value = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('descripcion').value = descripcion;
  document.getElementById('btn-cancelar').style.display = 'inline-block';
}
 
// 4. Función para eliminar un item
function del(id) {
  if (!confirm('¿Estás seguro de eliminar este item?')) return;
  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(() => fetchItems())
    .catch(err => console.error('Error al eliminar:', err));
}
 
// 5. Función para limpiar el formulario y cancelar edición
function resetForm() {
  document.getElementById('form-item').reset();
  document.getElementById('item-id').value = '';
  document.getElementById('btn-cancelar').style.display = 'none';
}
 
// 6. Escapar comillas en cadenas para evitar inyección JS
function escapeJS(str) {
  return str.replace(/'/g, "\'").replace(/"/g, '\"');
}
 
// Carga inicial de items al abrir la página
fetchItems();