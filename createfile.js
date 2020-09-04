
/**
 * Generate file & send download
 * @param {string} data exemple for csv '1,2,3\n4,5,6'
 * @param {string} fileName exemple: export
 * @param {string} ext extension: csv
 * @param {string} element require ID from your <a id="your-id"></a> for download file
 */
class generateFile{
    constructor( data, fileName, ext, element ){

        var object_file = this;
        
        new Promise( ( resolve, failureCallback ) => {

                object_file.element = document.getElementById( element );
                object_file.data = String( data );
                object_file.name = String( fileName );
                object_file.ext  = String( ext );

                if( typeof object_file.element !== 'object' || object_file.element === null )
                    failureCallback( 'Something has wrong with yours "element".' );
                else if( typeof object_file.data !== 'string' || object_file.data.length <= 0 )
                    failureCallback( 'Something has wrong with yours "data".' );
                else if(typeof object_file.name !== 'string'  || object_file.name.length <= 0 )
                    failureCallback( 'Something has wrong with yours "name".' );
                else if( typeof object_file.ext  !== 'string' || object_file.ext.length  <= 0)
                    failureCallback( 'Something has wrong with yours "ext".' );
                else {

                    object_file.blob = new Blob(
                        [ new Uint8Array( [ 0xEF, 0xBB, 0xBF ] ), object_file.data ], // Uint8Array for UTF-8 BOM
                        { type: "octet/stream;charset=utf-8" }
                    );

                    object_file.url = window.URL.createObjectURL( object_file.blob );
                    object_file.element.href = object_file.url;
                    object_file.element.download = object_file.name + '.' + object_file.ext;

                    if( ! object_file.blob ) failureCallback( 'Something has wrong with yours "blob".' );
                    else if( ! object_file.url ) failureCallback( 'Something has wrong with yours "url".' );
                    else if( ! object_file.element.href ) failureCallback( 'Something has wrong with yours "href".' );
                    else if( ! object_file.element.download ) failureCallback( 'Something has wrong with yours "download".' );

                    else resolve( object_file );
                }
            }
        ).then( function( object_file ){

            return object_file;

        }).catch( function( failureCallback ){
            throw new Error( failureCallback );
        });
    }
    /**
     * Trigger download
     */
    download(){
        this.element.click();
        window.URL.revokeObjectURL( this.url );
        this.element.href = '';
        this.element.download = '';
    }
};

let datafile = {
    data: '1,2,3\n4,5,6',
    name: 'export',
    ext: 'csv',
    element: 'toDownload'
};

const file = new generateFile( datafile.data, datafile.name, datafile.ext, datafile.element );

console.log( file );

//file.download();