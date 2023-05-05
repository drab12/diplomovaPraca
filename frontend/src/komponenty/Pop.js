import { Modal } from "bootstrap";




export default function Pop (props) {

    
    

function popUp(uloz){
    return <div>
               <button className="btn btn-success" onClick={uloz}>Ulož</button>
               <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModal"
                        style={{marginLeft: "10px"}}> Zruš                   
               </button>         
               <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                   <div className="modal-dialog">
                       <div className="modal-content">
                           <div className="modal-header">
                               <h5 className="modal-title" id="exampleModalLabel">Zrušiť zmeny</h5>
                           </div>
                           <div className="modal-body">
                               Naozaj chcete zrušiť zmeny
                           </div>
                           <div className="modal-footer">
                               <button type="button" className="btn btn-success" onClick={()=> {window.location.href= "/"}}>Áno</button>
                               <button type="button" className="btn btn-danger" data-dismiss="modal">Nie</button>   
                           </div>
                       </div>
                   </div>
               </div>
           </div>
   }
   return (
    <div>
       {popUp(props.ulozZaznam)}
        </div>
   )

}
