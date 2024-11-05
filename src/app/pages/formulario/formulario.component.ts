import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViacepService } from '../../_services/viacep.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent implements OnInit{

  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private viacepService: ViacepService){}

  ngOnInit(): void {
    this.initializeForm();
    this.observePreenchimmentoCep();
  }

  initializeForm() {
    this.form = this.fb.group({
      cep: ['', [Validators.required]],
      logradouro: [{value: '', disabled: true}],
      bairro: [{value: '', disabled: true}],
      cidade: [{value: '', disabled: true}],
      estado:[{value: '', disabled: true}],
    })
  }

  observePreenchimmentoCep() {
    this.form.get('cep')?.valueChanges.subscribe(value => {
      if(value?.length == 8) {
        this.buscarCep();
      }
    })
  }

  buscarCep(){
    var cep = this.form.get('cep')?.value;
    this.viacepService.getEnderecoByCep(cep).subscribe(
      {
        next: (response) => {
          this.form.patchValue({
            logradouro: response.logradouro,
            bairro: response.bairro,
            cidade: response.localidade,
            estado: response.uf,
          })
        },
        error: () => {
          console.log(' Erro ao buscar o CEP ');
        }
      }
    )
  }

}

