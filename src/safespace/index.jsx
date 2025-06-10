import { useEffect } from 'react';
import SafeSpaceView from './view/SafeSpaceView';
import SafeSpacePresenter from './presenter/SafeSpacePresenter';
import SafeSpaceModel from './model/SafeSpaceModel';

function SafeSpace() {
  const presenter = new SafeSpacePresenter(SafeSpaceModel);
  
  useEffect(() => {
    presenter.initialize();
  }, []);

  return <SafeSpaceView presenter={presenter} />;
}

export default SafeSpace; 