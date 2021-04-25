const parseTypeImageUrl = (type, size, bpType='icon') => {
  const url = `https://images.evetech.net/types/${type.id}/${bpType}?size=${size}`;
  return url
}

export default parseTypeImageUrl;
