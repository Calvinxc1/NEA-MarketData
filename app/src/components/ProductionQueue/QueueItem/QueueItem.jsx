import React from 'react';
import Button from 'react-bootstrap/Button';
import Figure from 'react-bootstrap/Figure';
import {useQuery} from 'react-query';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

import parseTypeImageUrl from './../../../tools/parseTypeImageUrl.js';
import getProductionQueue from './../../../api/getProductionQueue.js';
import QueueNeeds from './../QueueNeeds.jsx';
import Loading from './../../Loading/Loading.jsx';

const queryWrapper = (Component) => (props) => {
  const {queue_id} = props.match.params;
  const {data, status} = useQuery(['getProductionQueue', {queue_id}], getProductionQueue);
  return <Component {...props} data={data} status={status}/>;
};

const QueueItem = ({data, status}) => <div>
  {console.log(data)}
  {status === 'success' ? <div>
    <p><Link to='/production/queue'>
      <Button variant='outline-light'>
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Queue List
      </Button>
    </Link></p>
    <Figure>
      <Figure.Image
        width={128}
        height={128}
        src={parseTypeImageUrl(data.data.queue.path.type, 128)}
      />
      <Figure.Caption>{data.data.queue.path.type.name}</Figure.Caption>
    </Figure>
    <QueueNeeds needs={data.data.needs} />
  </div> : <Loading />}
</div>;

export default queryWrapper(QueueItem);
