import { Feature, FeatureDetail } from '../../models/models';
import { Component, OnInit } from '@angular/core';
import { FeatureService } from '../../service/feature.service';
import { AlertService } from '../../_alert/alert.service';

@Component({
  selector: 'app-feature-manager',
  templateUrl: './feature-manager.component.html',
  styleUrls: ['./feature-manager.component.css']
})
export class FeatureManagerComponent implements OnInit {

  constructor(
    private featureService: FeatureService,
    private alertService: AlertService
  ) { }

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  ngOnInit(): void {
    if (this.featureService.features.length == 0) {
      this.getAllFeature();
    }
  }

  getAllFeature() {
    this.featureService.GetFeatures()
      .then(data => {
        this.featureService.features = data;
        console.log(this.featureService.features)
        this.FeatureDetails = this.featureService.features[this.CurrentFeatureIndex].featureDetails;
      })
      .catch(error => {
        console.log(error)
      })
  }

  FeatureDetails: FeatureDetail[] = new Array();

  UpdateFeature: Feature = new Feature();
  UpdateFeatureDetail: FeatureDetail = new FeatureDetail();

  CreateFeature: Feature = new Feature();
  CreateFeatureDetail: FeatureDetail = new FeatureDetail();

  CurrentFeatureId: number;

  CurrentFeatureIndex: number = 0;

  onDetails = (index) => {
    this.FeatureDetails = this.featureService.features[index].featureDetails;
    this.CurrentFeatureId = this.featureService.features[index].id;
    this.CurrentFeatureIndex = index;
    console.log(this.FeatureDetails)
  }

  isRemoveFeature = true;
  removeFeatureId = -1;
  removeFeatureDetailId = -1;

  onDeleteFeature = (FeatureId) => {
    this.isRemoveFeature = true;
    this.removeFeatureId = FeatureId;
  }

  onDeleteFeatureDetail = (featureDetailId) => {
    this.isRemoveFeature = false;
    this.removeFeatureDetailId = featureDetailId;
  }

  onDelete = () => {
    if (this.isRemoveFeature) {
      console.log('remove feature with id = ' + this.removeFeatureId)
      this.featureService.DeleteFeature(this.removeFeatureId)
        .then(data => {
          this.alertService.clear();
          this.alertService.success("Xóa thành công!", this.options);
          this.getAllFeature();
        })
        .catch(() => {
          this.alertService.clear();
          this.alertService.error('Không thể xóa feature!', this.options);
        })
    }
    else {
      console.log('remove feature detail with id = ' + this.removeFeatureDetailId)
      this.featureService.DeleteFeatureContent(this.removeFeatureDetailId)
        .then(data => {
          this.alertService.clear();
          this.alertService.success("Xóa thành công!", this.options);
          this.getAllFeature();
          
        })
        .catch(() => {
          this.alertService.clear();
          this.alertService.error('Không thể xóa content!', this.options);
        })

    }
  }

  onClickUpdateFeature = (updateFeature) => {
    this.UpdateFeature = updateFeature;
    console.log(updateFeature);
  }

  onClickUpdateFeatureDetail = (updateFeatureDetail) => {
    this.UpdateFeatureDetail = updateFeatureDetail;
  }

  onUpdateFeature() {
    console.log(this.UpdateFeature);

    this.featureService.UpdateFeature(this.UpdateFeature)
      .then(() => {
        this.alertService.clear();
        this.alertService.success("Cập nhật thành công!", this.options);
        this.getAllFeature();
      })
      .catch(() => {
        this.alertService.clear();
        this.alertService.error("Không thể cập nhật!", this.options);
      })
  }

  onUpdateFeatureDetail() {
    console.log(this.UpdateFeatureDetail)
    this.UpdateFeatureDetail.featureId = this.CurrentFeatureId;
    this.featureService.UpdateFeatureContent(this.UpdateFeatureDetail)
      .then(() => {
        this.alertService.clear();
        this.alertService.success("Cập nhật thành công!", this.options);
        this.getAllFeature();
      })
      .catch(() => {
        this.alertService.clear();
        this.alertService.error("Không thể cập nhật!", this.options);
      })
  }

  onClickCreateFeature = () => {
    console.log(this.CreateFeature);

    this.featureService.AddFeature(this.CreateFeature)
      .then(() => {
        this.alertService.clear();
        this.alertService.success("Thêm thành công!", this.options);
        this.getAllFeature();
      })
      .catch(() => {
        this.alertService.clear();
        this.alertService.error("Không thể thêm!", this.options);
      })
  }

  onAddFeatureDetail() {
    console.log(this.CreateFeatureDetail)
    this.CreateFeatureDetail.featureId = this.CurrentFeatureId;

    this.featureService.AddFeatureContent(this.CreateFeatureDetail)
      .then(() => {
        this.alertService.clear();
        this.alertService.success("Thêm thành công!", this.options);
        this.getAllFeature();
      })
      .catch(() => {
        this.alertService.clear();
        this.alertService.error("Không thể thêm!", this.options);
      })
  }
}
