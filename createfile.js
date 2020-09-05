/**
 * Generate file & send download
 * @param {string} data exemple for csv '1,2,3\n4,5,6'
 * @param {string} fileName exemple: export
 * @param {string} ext extension: csv
 * @param {string} element ID exemple: your_id -> <a id="your_id"></a> for download file
 */
class generateFile{
    constructor( data, fileName, ext, element = false){

        var object_file = this;
        
        new Promise( ( resolve, failureCallback ) => {

            if( element )
                object_file.element = document.getElementById( element );
            else {
                object_file.element = document.createElement("a");
                object_file.isTemp = true;
            }

                object_file.data = String( data );
                object_file.name = String( fileName );
                object_file.ext  = String( ext );

                object_file.token = Math.random().toString(36).substr(2);

                if( typeof object_file.element !== 'object' || object_file.element === null )
                    failureCallback( 'Something has wrong with your "element".' );
                else if( typeof object_file.data !== 'string' || object_file.data.length <= 0 )
                    failureCallback( 'Something has wrong with your "data".' );
                else if(typeof object_file.name !== 'string'  || object_file.name.length <= 0 )
                    failureCallback( 'Something has wrong with your "name".' );
                else if( typeof object_file.ext  !== 'string' || object_file.ext.length  <= 0)
                    failureCallback( 'Something has wrong with your "ext".' );
                else {

                    object_file.blob = new Blob(
                        [ new Uint8Array( [ 0xEF, 0xBB, 0xBF ] ), object_file.data ], // Uint8Array for UTF-8 BOM
                        { type: "octet/stream;charset=utf-8" }
                    );

                    object_file.url = window.URL.createObjectURL( object_file.blob );
                    object_file.element.href = object_file.url;
                    object_file.element.download = object_file.name + '.' + object_file.ext;

                    object_file.element.style.display = 'none';
                    object_file.element.dataset.id = object_file.token;

                    if( ! object_file.blob ) failureCallback( 'Something has wrong with your "blob".' );
                    else if( ! object_file.url ) failureCallback( 'Something has wrong with your "url".' );
                    else if( ! object_file.element.href ) failureCallback( 'Something has wrong with your "href".' );
                    else if( ! object_file.element.download ) failureCallback( 'Something has wrong with your "download".' );

                else resolve( object_file );
            }
        }).then( function( object_file ){

            document.body.append( object_file.element );
            return object_file;

        }).catch( function( failureCallback ){

            if( ! document.querySelector('.error-message') ){
                let theParent = document.querySelector('.flexible');
                let theKid = document.createElement("div");
    
                theKid.className = 'error-message';
                theKid.innerHTML = failureCallback;
    
                theParent.insertBefore( theKid, theParent.firstChild );

            } else {
                let e_el = document.querySelector('.error-message');
                e_el.innerHTML = failureCallback;
            }
            throw new Error( failureCallback );
        });
    }
    /**
     * Trigger download
     */
    download(){
        new Promise( ( resolve, failureCallback ) => {
            setTimeout( () => {

                let element = document.querySelector( '[data-id="' + this.token + '"]' );

                if( ! element ) failureCallback('Element doesn\'t exist');
                    else resolve( element );

            }, 5);
        })
        .then( function( element ){

            element.click();
            window.URL.revokeObjectURL( element.url );

            element.href = "";
            element.download = "";
            element.dataset.id = "";

            if( this.isTemp )
                element.remove();
        })
        .catch( function( failureCallback ){
            throw new Error( failureCallback );
        });
    }
};