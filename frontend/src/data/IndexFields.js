import React from 'react';
import {ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";

export const render_list = (index, data, index_format, i, modal, toggle) => {

    const saveText = (text, filename) => {

        text = text.replace(/<p[^>]*>/g, "\n\n").replace(/<u[^>]*>/g, "\n").replace(/<[^>]*>/g, "")
            .replaceAll("&amp;", "&")
            .replaceAll("&quot;", "\"").replaceAll("&ldquo;", "\"").replaceAll("&rdquo;", "\"")
            .replaceAll("&ordm;", "°").replaceAll("&deg;", "°")
            .replaceAll("&nbsp;", " ").replaceAll("&#9;", "\n")
            .replaceAll("&Agrave;", "Á").replaceAll("&Aacute;", "Á").replaceAll("&agrave;", "á").replaceAll("&aacute;", "á")
            .replaceAll("&Egrave;", "É").replaceAll("&Eacute;", "É").replaceAll("&egrave;", "é").replaceAll("&eacute;", "é")
            .replaceAll("&Igrave;", "Í").replaceAll("&Iacute;", "Í").replaceAll("&igrave;", "í").replaceAll("&iacute;", "í")
            .replaceAll("&Ograve;", "Ó").replaceAll("&Oacute;", "Ó").replaceAll("&ograve;", "ó").replaceAll("&oacute;", "ó")
            .replaceAll("&Ugrave;", "Ú").replaceAll("&Uacute;", "Ú").replaceAll("&ugrave;", "ú").replaceAll("&uacute;", "ú")
            .replaceAll("&ntilde;", "ñ").replaceAll("&Ntilde;", "Ñ")
            .replace(/&.*;/g, "");

        var data = new Blob([text], {type: 'application/msword'});
        var textFile = window.URL.createObjectURL(data);
        if (document.getElementById('download') !== null) {
            document.body.removeChild(document.getElementById('download'));
        }
        var a = document.createElement("a");
        a.setAttribute("id", "download");
        a.setAttribute("href", textFile);
        a.setAttribute("download", filename);
        a.setAttribute("hidden", true);
        a.click();
        window.URL.revokeObjectURL(textFile);
        document.body.appendChild(a);
    }

    const is_hidden = (field) => {
        return field === null || field === '' || typeof field === 'undefined'
    }


    const __toggle = () => toggle(index, i);
    return (
        <ListGroupItem className="mb-2" key={i}>
            <div>
                <h6 hidden={index_format[index].pretitle.length === 0}>
                    {index_format[index].pretitle.map((value, idx1) =>
                        <p className="text-muted"
                           key={idx1}
                           hidden={is_hidden(data[value])}
                        >
                            {index_format[index].pretitle_name[idx1] + ': '}<b>{data[value]}</b>
                        </p>
                    )}

                </h6>
                <h5 className="-" hidden={is_hidden(data[index_format[index].title])}>
                    <small className="text-muted">{index_format[index].title_name}:<br/></small>{data[index_format[index].title]}
                </h5>
                <h6 className="-" hidden={is_hidden(data[index_format[index].subtitle])}>
                    <small className="text-muted">{index_format[index].subtitle_name}:<br/></small>{data[index_format[index].subtitle]}
                </h6>
            </div>

            <div>
                <Button className="my-2"
                        color="danger"
                        outline={true}
                        disabled={is_hidden(data[index_format[index].text])}
                        onClick={__toggle}>{index_format[index].text_name}</Button>

                <p hidden={index_format[index].footer.length === 0}>
                    {index_format[index].footer.map((value, idx2) =>
                        <small key={idx2}
                               hidden={is_hidden(data[value])}
                        >
                            {index_format[index].footer_name[idx2] + ': '}<b>{data[value]}</b><br/>
                        </small>
                    )}
                </p>

                <hr className="ml-0 pl-0 col-3"/>

                <p className="mt-3 text-muted" hidden={is_hidden(index_format[index].date)}>
                    <small>{'Fecha: ' + data[index_format[index].date].split('T')[0]}</small>
                </p>
            </div>

            <div className="col-10 my-4">
                <Modal centered={true} size="lg" className="p-0 m-auto" isOpen={modal === index + i.toString()}
                       toggle={__toggle}>
                    <ModalHeader toggle={__toggle}>{index_format[index].text_name}</ModalHeader>
                    <ModalBody>
                        <div id='body-text' dangerouslySetInnerHTML={{ __html: data[index_format[index].text]}} />
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