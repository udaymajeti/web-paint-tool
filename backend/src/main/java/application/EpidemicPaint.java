package application;

import java.sql.SQLException;
import java.util.EnumSet;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration.Dynamic;

import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.glassfish.jersey.media.multipart.MultiPartFeature;

import com.bazaarvoice.dropwizard.assets.ConfiguredAssetsBundle;
import com.google.common.base.Joiner;

import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import resources.ImageResource;

public class EpidemicPaint extends Application<ApplicationConfiguration> {

	private static final String API_URL_PATTERN = "/api/*";

	public static void main(final String[] args) throws Exception {
		new EpidemicPaint().run(args);
	}

	@Override
	public void run(final ApplicationConfiguration configuration, final Environment environment) throws SQLException {

		configureCrossOriginFilter(configuration, environment);

		ImageResource imageResource = new ImageResource();
		environment.jersey().register(imageResource);

		environment.jersey().register(MultiPartFeature.class);

	}

	private void configureCrossOriginFilter(ApplicationConfiguration configuration, Environment environment) {
		String[] allowedOrigins = configuration.getAllowedOrigins();
		if (allowedOrigins == null || allowedOrigins.length == 0) {
			return;
		}

		Dynamic filter = environment.servlets().addFilter("CrossOriginFilter", CrossOriginFilter.class);
		filter.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, API_URL_PATTERN);
		filter.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, Joiner.on(',').join(allowedOrigins));
		filter.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM,
				"X-Requested-With,Content-Type,Accept,Accept-Language,Origin,Authorization");
		filter.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,POST,PUT,DELETE");
		filter.setInitParameter(CrossOriginFilter.ALLOW_CREDENTIALS_PARAM, "true");
	}
	
	@Override
	public void initialize(Bootstrap<ApplicationConfiguration> configuration){
		configuration.addBundle(new ConfiguredAssetsBundle("/assets/","/","index.html"));
	}

}
