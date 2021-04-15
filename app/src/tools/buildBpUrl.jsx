const buildBpUrl = (type_id, bp_type) => {
  let img_ext;
  switch(bp_type) {
    case 'original':
      img_ext = 'bp';
      break;
    case 'copy':
      img_ext = 'bpc';
      break;
    case 'relic':
      img_ext = 'relic';
      break;
    default:
      img_ext = '';
  }

  const url = `https://images.evetech.net/types/${type_id}/${img_ext}`
  return url;
}

export default buildBpUrl;
