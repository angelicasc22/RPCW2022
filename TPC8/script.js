var id =-1
$(function(){
    $.get('http://localhost:7700/paras', function(data){
        data.forEach(function(data) {
            var edit = $("<button/>").css({"margin-left": "20px"}).text("Editar")
            edit.click(function() {
                id = data._id
                $("#novoPar").val(data.para);
            })

            var apagar = $("<button/>").css({"margin-left": "10px"}).text("Apagar")
            apagar.click(function() {
                id = data._id
                $.ajax({
                    url: 'http://localhost:7700/paras/apagar/' + id,
                    type: 'DELETE',
                    success: function(response) {
                        alert("Parágrafo apagado com sucesso!")
                        location.reload()
                    }
                });
                
            })
            var elem = $("<li style=\"margin-bottom: 10px;\" ><b>"+ data.data +":</b> " + data.para + "</li>")
                elem.append(edit).append(apagar)
                $("#paras").append(elem);
        })
    })

    $("#botao").click(function(){
        if (id == -1){
          $.post('http://localhost:7700/paras',$("#novoPar").serialize())
          alert('Parágrafo inserido: ' + ($("#novoPar").val()))
          $("#novoPar").val("")
          location.reload()
        }
        else{
          $.ajax({
            url: 'http://localhost:7700/paras/editar/'+id,
            type: 'PUT',
            data:$("#paraForm").serialize(),
            success: function(response) {
                alert('Parágrafo editado: ' + ($("#novoPar").val()));
                $("#novoPar").val("");
                id = -1;
                location.reload();
            }
          });
        }
    })
});
