class KoneksiBasisData {
  constructor() {
    this.execute();
  }

  execute(){
    module.exports = {
      database: 'mongodb://localhost:27017/destbankdb',
      secret: 'yoursecret'
    }
  }

}

new KoneksiBasisData();
