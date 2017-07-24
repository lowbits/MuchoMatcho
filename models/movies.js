/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var movies =  sequelize.define('movies', {
    movielens_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    age_rating_de: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    age_rating_us: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    backdrop_image_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    budget: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    homepage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imdb_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    original_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    plot: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    poster_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    revenue: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    runtime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tagline: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title_de: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title_us: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tmdb_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    trailer_youtube_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  });

movies.associate = function (models) {
 movies.hasOne(models.item_factor_values, {foreignKey: "item_id"});
 movies.belongsToMany(models.directors, {through: 'movies_directors', foreignKey: 'movie_movielens_id'});
};

  return movies;
};
