require 'digest'
require 'fileutils'
require 'tmpdir'

# The Intercom pod is no longer published to the CocoaPods trunk; fetch the GitHub release instead.
module IntercomIosSdk
  RELEASE_URL = 'https://github.com/intercom/intercom-ios/releases/download/%s/Intercom.xcframework.zip'.freeze

  module_function

  def install_xcframework(version:, sha256:, package_root:)
    relative_path = File.join('intercom-ios-sdk', version, 'Intercom.xcframework')
    framework_path = File.join(package_root, relative_path)
    unless File.exist?(File.join(framework_path, 'Info.plist'))
      extract(cached_zip(version, sha256), File.dirname(framework_path))
    end
    relative_path
  end

  def cache_dir
    ENV['INTERCOM_IOS_SDK_CACHE_DIR'] || File.join(Dir.home, 'Library', 'Caches', 'intercom-react-native')
  end

  def cached_zip(version, sha256)
    zip_path = File.join(cache_dir, version, 'Intercom.xcframework.zip')
    return zip_path if File.exist?(zip_path) && Digest::SHA256.file(zip_path).hexdigest == sha256

    url = format(RELEASE_URL, version)
    download_path = "#{zip_path}.download"
    FileUtils.mkdir_p(File.dirname(zip_path))
    Pod::UI.puts "[Intercom] Downloading the Intercom iOS SDK #{version} from #{url}"
    unless system('curl', '--fail', '--silent', '--show-error', '--location', '--retry', '3', '--output', download_path, url)
      FileUtils.rm_f(download_path)
      raise "[Intercom] Could not download #{url}. Check your network, or place the zip at #{zip_path} " \
            '(set INTERCOM_IOS_SDK_CACHE_DIR to use another cache directory).'
    end

    actual = Digest::SHA256.file(download_path).hexdigest
    unless actual == sha256
      FileUtils.rm_f(download_path)
      raise "[Intercom] Checksum mismatch for #{url}: expected #{sha256}, got #{actual}."
    end
    File.rename(download_path, zip_path)
    zip_path
  end

  def extract(zip_path, destination)
    FileUtils.mkdir_p(destination)
    Dir.mktmpdir('extract-', destination) do |tmp|
      raise "[Intercom] Could not unzip #{zip_path}." unless system('unzip', '-q', zip_path, '-d', tmp)

      target = File.join(destination, 'Intercom.xcframework')
      FileUtils.rm_rf(target)
      File.rename(File.join(tmp, 'Intercom.xcframework'), target)
    end
  end
end
