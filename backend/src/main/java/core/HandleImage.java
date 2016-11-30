package core;

import java.io.InputStream;

import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

public interface HandleImage {
	public Response downloadImageFile();

	public Response uploadImageFile(InputStream fileInputStream,
			FormDataContentDisposition fileFormDataContentDisposition);
}
