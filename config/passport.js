const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Faculty = require("../models/faculty");
const Student = require("../models/student");
const Admin = require("../models/admin");
const Dekan = require("../models/dekan");
const NewsAdmin = require("../models/newsadmin");

const keys = require("./key");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
	passport.use(
		new JwtStrategy(opts, async (jwt_payload, done) => {
			const dekan = await Dekan.findById(jwt_payload.id);
			const faculty = await Faculty.findById(jwt_payload.id);
			const student = await Student.findById(jwt_payload.id);
			const admin = await Admin.findById(jwt_payload.id);
			const news = await NewsAdmin.findById(jwt_payload.id);
			if (dekan) {
				return done(null, dekan);
			} else if (student) {
				return done(null, student);
			} else if (admin) {
				return done(null, admin);
			} else if (faculty) {
				return done(null, faculty);
			} else if (news) {
				return done(null, news);
			} else {
				console.log("Error");
			}
		})
	);
};
