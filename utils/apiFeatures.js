class ApiFeatures {
  constructor(query, queryStr) {
    // query = find method queryStr is the value of query
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          // If keyword is found then this is done
          name: {
            $regex: this.queryStr.keyword, // if keyword is found then in object named "name" regex = keyword
            $options: "i", // due to this keyword is case insensitive
          },
        }
      : {
          // If keyword is not found then this is done
        };

    this.query = this.query.find({ ...keyword });
    return this;
  }
}

module.exports = ApiFeatures;
