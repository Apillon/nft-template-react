import { useEffect, useState } from 'react';
import { APILLON_API_KEY, APILLON_API_SECRET, APILLON_API_URL, COLLECTION_BUCKET_UUID } from '../lib/config';

const CollectionMetadataInfo = () => {
  const [state, setState] = useState({
    collectionLogo: '' as string | undefined,
    collectionCover: '' as string | undefined
  });

  useEffect(() => {
    getCollectionMetadata();
  }, []);

  const getCollectionMetadata = async () => {
    const metadata = await fetchCollectionMetadata();
    setState({
      collectionLogo: metadata.collectionLogo,
      collectionCover: metadata.collectionCover
    });
  };

  return (
    <div>
      {(state.collectionLogo || state.collectionCover) && (
        <div>
          <div className="collection-header">
            {state.collectionLogo && (
              <div className="logo-container">
                <img src={state.collectionLogo} alt="Collection Logo" className="collection-logo" />
              </div>
            )}
            <h1 className="collection-title">Collection</h1>
          </div>
          {state.collectionCover && (
            <div className="cover-container">
              <img src={state.collectionCover} alt="Collection Cover" className="collection-cover" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

 async function fetchCollectionMetadata(){
    const url = `${APILLON_API_URL}/storage/${COLLECTION_BUCKET_UUID}/content`;
    const metadata = {
        collectionLogo: '' as string | undefined,
        collectionCover: '' as string | undefined
    };
    try{
      const content = await fetch(url, {
        headers:{
          'Authorization': `Basic ${Buffer.from(`${APILLON_API_KEY}:${APILLON_API_SECRET}`).toString('base64')}`
        }
      }).then(response => {
        return response.json();
      });
  
      const items = content.data?.items ?? [];
  
      metadata.collectionLogo =items.find((item: {
        type: number;
        name: string;
      }) => item.type === 2 && item.name.includes('logo'))?.link;
  
  
      metadata.collectionCover =items.find((item: {
        type: number;
        name: string;
      }) => item.type === 2 && item.name.includes('cover'))?.link;
      
    }
    catch(e){
      console.error(e);
      metadata.collectionLogo = undefined;
      metadata.collectionCover = undefined;
    }

    return metadata;
}
export default CollectionMetadataInfo;