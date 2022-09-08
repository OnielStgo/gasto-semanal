//Variáveis//
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos//
eventListeners()

function eventListeners(){
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

  formulario.addEventListener('submit', agregarGasto)
}

//Clases//

class Presupuesto {
  constructor(presupuesto){
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  novoGasto(gasto){
    this.gastos = [...this.gastos, gasto]
    
    this.calcularRestante();
  }

  calcularRestante(){
    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id){
    this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    this.calcularRestante();
  }  

}

class UI {
  instertarPresupuesto(cantidad){
    //extraindo os valores
    const {presupuesto, restante} = cantidad;

    //agregando ao HTML
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;

  }

  imprimirAlerta(mensagem, tipo){
    //criar div
    const divMensagem = document.createElement('div');
    divMensagem.classList.add('text-center', 'alert')

    if(tipo === 'error'){
      divMensagem.classList.add('alert-danger');
    } else {
      divMensagem.classList.add('alert-success');
    }

    //mensagem de erro
    divMensagem.textContent = mensagem;

    //insertar no HTML
    document.querySelector('.primario').insertBefore(divMensagem, formulario);

    //apagar mensagem
    setTimeout(() => {
      divMensagem.remove();
    }, 3000)

  }

  mostrarGastos(gastos){

    this.limparHTML();   //eliminar o HTML prévio

    gastos.forEach(gasto => {

      const {cantidad, nombre, id} = gasto;
      
      //criar um li
      const novoGasto = document.createElement('li');
      novoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
      novoGasto.dataset.id = id;
      
      //adicionar o HTML da despesa
      novoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">R$ ${cantidad} </span>`

      //boton para eliminar a despesa
      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.innerHTML = 'Deletar &times';
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      }
      novoGasto.appendChild(btnBorrar);

      //adicionar ao HTML
      gastoListado.appendChild(novoGasto);
    });
  }

  //limpar o HTML
  limparHTML(){
    while(gastoListado.firstChild){
      gastoListado.removeChild(gastoListado.firstChild)
    }
  }

  atualizarRestante(restante){
    document.querySelector('#restante').textContent = restante; 
  }

  comprovarPresupuesto(presupestoObj){
    const {presupuesto, restante} = presupestoObj;
    
    const restanteDiv = document.querySelector('.restante'); 

    //comprovar 25% e 50%
    if((presupuesto / 4) > restante){
      restanteDiv.classList.remove('alert-success', 'alert-warning');
      restanteDiv.classList.add('alert-danger');
    } else if((presupuesto / 2) > restante){
      restanteDiv.classList.remove('alert-success');
      restanteDiv.classList.add('alert-warning');
    } else {
      restanteDiv.classList.remove('alert-danger', 'alert-warning');
      restanteDiv.classList.add('alert-success');
    }

    //Se o total é menor o igual a 0
    if(restante <= 0){
      ui.imprimirAlerta('O orçamento está esgotado', 'error');

      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }  
}

//Instanciar
const ui = new UI();

let presupuesto;

//Funções//

function preguntarPresupuesto(){
  const presupuestoUsuario = prompt('Qual é seu orçamento?');
  
  if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
    window.location.reload();
  }

  //presupesto válido
  presupuesto = new Presupuesto(presupuestoUsuario);
  
  ui.instertarPresupuesto(presupuesto);
}

function agregarGasto(e){
  e.preventDefault();

  //ler dados do formulario
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  //validar
  if(nombre === '' || cantidad === ''){
    ui.imprimirAlerta('Todos os campos são obrigatórios', 'error');
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta('Quantidade não válida', 'error')
    return;
  }

  //gerar um objeto com o gasto
  const gasto = {nombre, cantidad, id: Date.now()};

  //adicionar novo gasto
  presupuesto.novoGasto(gasto)

  //mensagem de tudo ok
  ui.imprimirAlerta('Despesa adicionada corretamente');

  //mostrar as despesas
  const {gastos, restante} = presupuesto
  ui.mostrarGastos(gastos);

  ui.atualizarRestante(restante);

  ui.comprovarPresupuesto(presupuesto);

  //limpar o formulario
  formulario.reset();
  
}

function eliminarGasto(id){
  //elimina do objeto
  presupuesto.eliminarGasto(id);

  //elimina as despesas do HTML
  const {gastos, restante} = presupuesto;
  ui.mostrarGastos(gastos);
  ui.atualizarRestante(restante);
  ui.comprovarPresupuesto(presupuesto);
}