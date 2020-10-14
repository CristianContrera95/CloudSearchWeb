import React from 'react';
import {ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";

export const render_list = (index, data, index_format, i, modal, toggle) => {

    const saveText = (text, filename) => {
        var data = new Blob([text], {type: 'application/msword'});
        var textFile = window.URL.createObjectURL(data);
        if (document.getElementById('download') !== null) {
            document.body.removeChild(document.getElementById('download'));
        }
        var a = document.createElement("a");
        a.setAttribute("id", "download");
        a.setAttribute("href", textFile);
        a.setAttribute("download", filename);
        a.textContent = "Click here to download the test for the students";
        a.click();
        window.URL.revokeObjectURL(textFile);
        document.body.appendChild(a);
    }


    const __toggle = () => toggle(index, i);
    return (
        <ListGroupItem className="mb-2" key={i}>
            <div>
                <h6 hidden={index_format[index].pretitle.length === 0}>
                    {index_format[index].pretitle.map((value, idx1) =>
                        <p className="text-muted" key={idx1}>{value + ': '}<b>{data[value]}</b></p>
                    )}

                </h6>
                <h3 className="title">{data[index_format[index].title] || 'Sin titulo'}</h3>
                <h5 className="text-muted">{data[index_format[index].subtitle] || 'Sin subtitulo'}:</h5>
            </div>

            <div>
                <Button className="my-2" color="danger" onClick={__toggle}>{index_format[index].text}</Button>

                <p hidden={index_format[index].footer.length === 0}>
                    {index_format[index].footer.map((value, idx2) =>
                        <small key={idx2}>{value + ': '}<b>{data[value]}</b><br/></small>
                    )}
                </p>

                <hr className="ml-0 pl-0 col-3"/>

                <p className="mt-3 text-muted" hidden={index_format[index].date === ''}>
                    <small>{'Fecha: ' + data[index_format[index].date].split('T')[0]}</small>
                </p>
            </div>

            <div className="col-10 my-4">
                <Modal centered={true} size="lg" className="p-0 m-auto" isOpen={modal === index + i.toString()}
                       toggle={__toggle}>
                    <ModalHeader toggle={__toggle}>Texto</ModalHeader>
                    <ModalBody>
                        <div dangerouslySetInnerHTML={{ __html: data[index_format[index].text]}} />
                        {/*{data[index_format[index].text]}*/}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={__toggle}>Cerrar</Button>
                        <Button color="secondary"
                                onClick={(e) => saveText(data[index_format[index].text], data[index_format[index].title] + '.docx')}>
                            Descargar
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </ListGroupItem>
    );
}

//     if (index === 'azuresql-index')
//         return (
//         <ListGroupItem key={i}>
//             <div>
//                 {/*<h6>*/}
//                 {/*    <p className="text-muted">{'Tribunal: '}<b>{data['TribunalEmisor']}</b></p>*/}
//                 {/*    <p className="text-muted">{'Materia: '}<b>{data['Materia']}</b></p>*/}
//                 {/*</h6>*/}
//                 <h3 className="title">{data['TextoFallo'] || 'Sin Texto Fallo'}</h3>
//             </div>
//             <div>
//                 <h5 className="text-muted">{data['CaratulaPublica'] || 'Sin Caratula Publica'}:</h5>
//                 <p className="subtitle">{data['TextoSumario'] || 'Sin Texto Sumario'}</p>
//                 <Button color="danger" onClick={__toggle}>{'Ver mas'}</Button>
//                 <p>
//                     <small>{'Voz Principal: '}</small><b>{data['VozPrincipal']}</b><br/>
//                     <small>{'Voz Secundaria: '}</small><b>{data['VozSecundaria']}</b>
//                 </p>
//                 <hr className="ml-0 pl-0 col-3"/>
//                 <p className="mt-3 text-muted">
//                     <small>{'Fecha: ' + data['Fecha'].split('T')[0]}</small>
//                 </p>
//             </div>
//             <div className="col-10 my-4">
//                 <Modal centered={true} size="lg" className="p-0 m-auto" isOpen={modal === index+i.toString()} toggle={__toggle}>
//                     <ModalHeader toggle={__toggle}>Texto Sumario</ModalHeader>
//                     <ModalBody>
//                         {data['TextoSumario']}
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button color="secondary" onClick={__toggle}>Cerrar</Button>
//                     </ModalFooter>
//                 </Modal>
//             </div>
//         </ListGroupItem>);
//
//     if (index === 'search-fallo')
//         return (
//             <ListGroupItem key={i}>
//                 <div>
//                     <h6>
//                         <p className="text-muted">{'Tribunal: '}<b>{data['TribunalEmisor']}</b></p>
//                         <p className="text-muted">{'Materia: '}<b>{data['Materia']}</b></p>
//                     </h6>
//                     <h3 className="title">{data['TextoFallo'] || 'Sin Texto Fallo'}</h3>
//                 </div>
//                 <div>
//                     <h5 className="text-muted">{data['CaratulaPublica'] || 'Sin Caratula Publica'}:</h5>
//                     <p className="subtitle">{data['TextoSumario'] || 'Sin Texto Sumario'}</p>
//                     <Button color="danger" onClick={__toggle}>{'Ver mas'}</Button>
//                     <p>
//                         <small>{'Voz Principal: '}</small><b>{data['VozPrincipal']}</b><br/>
//                         <small>{'Voz Secundaria: '}</small><b>{data['VozSecundaria']}</b>
//                     </p>
//                     <hr className="ml-0 pl-0 col-3"/>
//                     <p className="mt-3 text-muted">
//                         <small>{'Fecha: ' + data['Fecha'].split('T')[0]}</small>
//                     </p>
//                 </div>
//                 <div className="col-10 my-4">
//                     <Modal size="lg" className="p-0 m-auto" isOpen={modal === index+i.toString()} toggle={__toggle}>
//                         <ModalHeader toggle={__toggle}>Texto Sumario</ModalHeader>
//                         <ModalBody>
//                             {data['TextoSumario']}
//                         </ModalBody>
//                         <ModalFooter>
//                             <Button color="secondary" onClick={__toggle}>Cerrar</Button>
//                         </ModalFooter>
//                     </Modal>
//                 </div>
//             </ListGroupItem>);
//
//     if (index === 'sentencias-index')
//         return (
//         <ListGroupItem key={i}>
//             <div>
//                 <h6>
//                     <p className="text-muted">{'Fuero: '}<b>{data['Fuero']}</b></p>
//                     <p className="text-muted">{'Instancia: '}<b>{data['Instancia']}</b></p>
//                 </h6>
//                 {/*<h3 className="title">{data['TextoFallo'] || 'Sin Texto Fallo'}</h3>*/}
//             </div>
//             <div>
//                 <h5 className="text-muted">{data['Caratula'] || 'Sin Caratula'}:</h5>
//                 <Button color="danger" onClick={__toggle}>{'Texto'}</Button>
//                 <p>
//                     <small>{'Organismo: '}</small><b>{data['Organismo']}</b><br/>
//                     <small>{'Departamento_Judicial: '}</small><b>{data['Departamento_Judicial']}</b>
//                 </p>
//                 <hr className="ml-0 pl-0 col-3"/>
//                 <p className="mt-3 text-muted">
//                     <small>{'Fecha: ' + data['Fecha_Tramite'].split('T')[0]}</small>
//                 </p>
//             </div>
//             <div className="col-10 my-4">
//                 <Modal size="lg" className="p-0 m-auto" isOpen={modal === index+i.toString()} toggle={__toggle}>
//                     <ModalHeader toggle={__toggle}>Texto</ModalHeader>
//                     <ModalBody>
//                         <div dangerouslySetInnerHTML={{ __html: data['Texto'] }} />
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button color="secondary" onClick={__toggle}>Cerrar</Button>
//                     </ModalFooter>
//                 </Modal>
//             </div>
//         </ListGroupItem>);
// };